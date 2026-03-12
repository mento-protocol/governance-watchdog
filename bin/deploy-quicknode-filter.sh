#!/usr/bin/env bash
# shellcheck disable=SC2310,SC2311,SC2312
set -euo pipefail

# =============================================================================
# DEPLOY QUICKNODE FILTER FUNCTIONS
#
# QuickNode's API rejects PATCH requests to active webhooks, so Terraform
# can't manage filter_function updates via normal `terraform apply`.
# This script handles the pause → update → activate lifecycle manually.
#
# Usage:
#   ./bin/deploy-quicknode-filter.sh [--webhook healthcheck|governor|all]
#
# Prerequisites:
#   - gcloud CLI authenticated with access to the governance-watchdog project
#   - curl, base64, python3 available
#   - QuickNode API key stored in GCP Secret Manager as "quicknode-api-key"
# =============================================================================

WEBHOOK_TARGET="${1:-all}"
if [[ ${WEBHOOK_TARGET} == "--webhook" ]]; then
	WEBHOOK_TARGET="${2:-all}"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FILTER_DIR="${REPO_ROOT}/infra/quicknode-filter-functions"

# Webhook IDs (from QuickNode API)
HEALTHCHECK_WEBHOOK_ID="dc35c3c4-b839-49f6-836b-6ffb7c087419"
GOVERNOR_WEBHOOK_ID="73a99141-e8cb-411a-9732-c42a031cebe6"

QN_API_BASE="https://api.quicknode.com/webhooks/rest/v1/webhooks"

# ------------------------------------------------------------------------------
log() { printf '\n\033[1m%s\033[0m\n' "$*"; }
success() { printf '✅ %s\n' "$*"; }
info() { printf '   %s\n' "$*"; }

# curl wrapper: captures body + HTTP status, returns body via stdout.
# Exits non-zero and prints the response body when HTTP status is not 2xx.
curl_api() {
	local raw http_code body
	raw=$(curl -s -w "\n__HTTP_STATUS__%{http_code}" "$@" 2>&1)
	http_code=$(printf '%s' "${raw}" | grep -o '__HTTP_STATUS__[0-9]*' | grep -o '[0-9]*')
	body=$(printf '%s' "${raw}" | sed 's/__HTTP_STATUS__[0-9]*$//')
	if [[ ! ${http_code} =~ ^2 ]]; then
		printf '%s\n' "${body}"
		return 1
	fi
	printf '%s\n' "${body}"
}
# ------------------------------------------------------------------------------

fetch_api_key() {
	log "Fetching QuickNode API key from Secret Manager..."
	project_id=$(gcloud config get-value project 2>/dev/null)
	if [[ -z ${project_id} ]]; then
		echo "❌ No gcloud project set. Run: gcloud config set project <project-id>"
		exit 1
	fi
	QN_API_KEY=$(gcloud secrets versions access latest \
		--secret=quicknode-api-key \
		--project="${project_id}" 2>/dev/null)
	if [[ -z ${QN_API_KEY} ]]; then
		echo "❌ Could not fetch QuickNode API key from Secret Manager."
		echo "   Make sure your gcloud account has secretmanager.secretAccessor on the project."
		exit 1
	fi
	success "API key fetched (${#QN_API_KEY} chars)"
}

deploy_webhook() {
	local webhook_id="$1"
	local filter_file="$2"
	local webhook_name="$3"

	log "Deploying filter for webhook: ${webhook_name} (${webhook_id})"
	info "Filter file: ${filter_file}"

	if [[ ! -f ${filter_file} ]]; then
		echo "❌ Filter file not found: ${filter_file}"
		exit 1
	fi

	# These are evmAbiFilter template-based webhooks. The .js filter file embeds the
	# ABI and contract addresses in the comment header and in the JS code itself.
	# Template-based webhooks cannot have filter_function updated directly via PATCH
	# /webhooks/{id} — they require PATCH /webhooks/{id}/template/{templateId} with
	# templateArgs: { abi, contracts }.

	# Extract abi JSON array and contracts array from the .js file comment header
	local abi_json
	abi_json=$(python3 -c "
import re, sys
content = open(sys.argv[1]).read()
# Extract 'abi: <JSON>' from the comment block
m = re.search(r'/\*.*?template: evmAbiFilter\s+abi: (\[.*?\])\s+contracts: (.+?)\s*\*/', content, re.DOTALL)
if not m:
    print('ERROR: could not parse abi/contracts from comment header', file=sys.stderr)
    sys.exit(1)
import json
abi = json.loads(m.group(1))
contracts_raw = m.group(2).strip()
# contracts may be comma-separated addresses
contracts = [c.strip() for c in contracts_raw.split(',')]
print(json.dumps({'abi': abi, 'contracts': contracts}))
" "${filter_file}") || {
		echo "❌ Failed to parse ABI/contracts from ${filter_file}"
		exit 1
	}

	local update_payload
	update_payload=$(python3 -c "
import json, sys
d = json.loads(sys.argv[1])
payload = {'templateArgs': {'abi': d['abi'], 'contracts': d['contracts']}}
print(json.dumps(payload))
" "${abi_json}")

	info "Contracts: $(python3 -c "import json,sys; d=json.loads(sys.argv[1]); print(', '.join(d['templateArgs']['contracts']))" "${update_payload}")"

	# Update via the template endpoint (no pause/unpause needed for template updates)
	log "Updating template args via /template/evmAbiFilter endpoint..."
	local update_response
	update_response=$(curl_api -X PATCH "${QN_API_BASE}/${webhook_id}/template/evmAbiFilter" \
		-H "x-api-key: ${QN_API_KEY}" \
		-H "Content-Type: application/json" \
		-d "${update_payload}") || {
		echo "❌ Failed to update template args. API response:"
		echo "${update_response}"
		exit 1
	}
	success "Template args updated"

	# Verify
	log "Verifying deployment..."
	local verify_response
	verify_response=$(curl_api "${QN_API_BASE}/${webhook_id}" \
		-H "x-api-key: ${QN_API_KEY}" \
		-H "Content-Type: application/json") || {
		echo "❌ Failed to verify webhook. API response:"
		echo "${verify_response}"
		exit 1
	}
	local live_status
	live_status=$(echo "${verify_response}" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status','unknown'))")
	local template_id
	template_id=$(echo "${verify_response}" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('templateId','none'))")

	info "Status: ${live_status}"
	info "Template: ${template_id}"

	if [[ ${live_status} == "active" ]]; then
		success "Webhook ${webhook_name} deployed successfully!"
	else
		echo "⚠️  Unexpected status '${live_status}' after deploy. Check QuickNode dashboard."
		exit 1
	fi
}

main() {
	log "QuickNode Filter Deployment Script"
	printf "Target: %s\n" "${WEBHOOK_TARGET}"

	fetch_api_key

	case "${WEBHOOK_TARGET}" in
	healthcheck)
		deploy_webhook \
			"${HEALTHCHECK_WEBHOOK_ID}" \
			"${FILTER_DIR}/sorted-oracles.js" \
			"SortedOracles (healthcheck)"
		;;
	governor)
		deploy_webhook \
			"${GOVERNOR_WEBHOOK_ID}" \
			"${FILTER_DIR}/governor.js" \
			"MentoGovernor"
		;;
	all)
		deploy_webhook \
			"${HEALTHCHECK_WEBHOOK_ID}" \
			"${FILTER_DIR}/sorted-oracles.js" \
			"SortedOracles (healthcheck)"
		deploy_webhook \
			"${GOVERNOR_WEBHOOK_ID}" \
			"${FILTER_DIR}/governor.js" \
			"MentoGovernor"
		;;
	*)
		echo "❌ Unknown target: ${WEBHOOK_TARGET}"
		echo "Usage: $0 [--webhook healthcheck|governor|all]"
		exit 1
		;;
	esac

	log "🎉 All done!"
}

main
