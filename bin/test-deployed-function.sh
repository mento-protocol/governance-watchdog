#!/bin/bash
set -e          # Fail on any error
set -o pipefail # Ensure piped commands propagate exit codes properly
set -u          # Treat unset variables as an error when substituting

# Check if an argument was provided
if [[ $# -eq 0 ]]; then
	echo "Error: Please provide a test type (ProposalCreated, ProposalQueued, ProposalExecuted, ProposalCanceled, or healthcheck)"
	exit 1
fi

TEST_TYPE=$1

# Map the test type to the corresponding fixture file
case ${TEST_TYPE} in
"ProposalCreated")
	FIXTURE_FILE="src/proposal-created/fixture.json"
	;;
"ProposalQueued")
	FIXTURE_FILE="src/proposal-queued/fixture.json"
	;;
"ProposalExecuted")
	FIXTURE_FILE="src/proposal-executed/fixture.json"
	;;
"ProposalCanceled")
	FIXTURE_FILE="src/proposal-canceled/fixture.json"
	;;
"healthcheck")
	FIXTURE_FILE="src/health-check/fixture.json"
	;;
*)
	echo "Error: Invalid test type. Must be one of: ProposalCreated, ProposalQueued, ProposalExecuted, ProposalCanceled, healthcheck"
	exit 1
	;;
esac

# This only works if the function has been deployed and your `terraform` can access the state backend
raw_function_url=$(terraform -chdir=infra output -json function_uri)
function_url=$(echo "${raw_function_url}" | jq -r)
auth_token=$(gcloud secrets versions access latest --secret x-auth-token)

curl "${function_url}" \
	-H "Content-Type: application/json" \
	-H "X-AUTH-TOKEN: ${auth_token}" \
	-d @"${FIXTURE_FILE}"
