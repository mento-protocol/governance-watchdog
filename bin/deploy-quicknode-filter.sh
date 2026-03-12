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
if [[ "${WEBHOOK_TARGET}" == "--webhook" ]]; then
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
# ------------------------------------------------------------------------------

fetch_api_key() {
  log "Fetching QuickNode API key from Secret Manager..."
  project_id=$(gcloud config get-value project 2>/dev/null)
  if [[ -z "${project_id}" ]]; then
    echo "❌ No gcloud project set. Run: gcloud config set project <project-id>"
    exit 1
  fi
  QN_API_KEY=$(gcloud secrets versions access latest \
    --secret=quicknode-api-key \
    --project="${project_id}" 2>/dev/null)
  if [[ -z "${QN_API_KEY}" ]]; then
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

  if [[ ! -f "${filter_file}" ]]; then
    echo "❌ Filter file not found: ${filter_file}"
    exit 1
  fi

  # Base64-encode the filter function
  local encoded_filter
  encoded_filter=$(base64 <"${filter_file}" | tr -d '\n')
  info "Encoded filter: ${#encoded_filter} chars"

  # Step 1: Pause the webhook
  log "Step 1/3: Pausing webhook..."
  local pause_response
  pause_response=$(curl -sf -X PATCH "${QN_API_BASE}/${webhook_id}" \
    -H "x-api-key: ${QN_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"status": "paused"}' 2>&1) || {
    echo "❌ Failed to pause webhook: ${pause_response}"
    exit 1
  }
  success "Webhook paused"

  # Step 2: Update the filter function
  log "Step 2/3: Updating filter function..."
  local update_payload
  update_payload=$(python3 -c "
import json, sys
payload = {'filter_function': sys.argv[1]}
print(json.dumps(payload))
" "${encoded_filter}")

  local update_response
  update_response=$(curl -sf -X PATCH "${QN_API_BASE}/${webhook_id}" \
    -H "x-api-key: ${QN_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "${update_payload}" 2>&1) || {
    echo "❌ Failed to update filter function: ${update_response}"
    echo "⚠️  Attempting to reactivate webhook before exiting..."
    curl -sf -X PATCH "${QN_API_BASE}/${webhook_id}" \
      -H "x-api-key: ${QN_API_KEY}" \
      -H "Content-Type: application/json" \
      -d '{"status": "active"}' >/dev/null 2>&1 || true
    exit 1
  }
  success "Filter function updated"

  # Step 3: Reactivate the webhook
  log "Step 3/3: Reactivating webhook..."
  local activate_response
  activate_response=$(curl -sf -X PATCH "${QN_API_BASE}/${webhook_id}" \
    -H "x-api-key: ${QN_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"status": "active"}' 2>&1) || {
    echo "❌ Failed to reactivate webhook: ${activate_response}"
    echo "⚠️  Webhook is still paused! Manually reactivate at: https://dashboard.quicknode.com"
    exit 1
  }
  success "Webhook reactivated"

  # Verify
  log "Verifying deployment..."
  local verify_response
  verify_response=$(curl -sf "${QN_API_BASE}/${webhook_id}" \
    -H "x-api-key: ${QN_API_KEY}" \
    -H "Content-Type: application/json" 2>&1)
  local live_status
  live_status=$(echo "${verify_response}" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status','unknown'))")
  local has_filter
  has_filter=$(echo "${verify_response}" | python3 -c "import json,sys; d=json.load(sys.stdin); print('yes' if d.get('filter_function') else 'no')")

  info "Status: ${live_status}"
  info "Filter present: ${has_filter}"

  if [[ "${live_status}" == "active" && "${has_filter}" == "yes" ]]; then
    success "Webhook ${webhook_name} deployed successfully!"
  else
    echo "⚠️  Unexpected state after deploy. Check QuickNode dashboard."
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
