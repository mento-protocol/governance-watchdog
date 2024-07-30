#!/bin/bash
set -e          # Fail on any error
set -o pipefail # Ensure piped commands propagate exit codes properly
set -u          # Treat unset variables as an error when substituting

# This only works if the function has been deployed and your `terraform` can access the state backend
raw_function_url=$(terraform -chdir=infra output -json function_uri)
function_url=$(echo "${raw_function_url}" | jq -r)

curl "${function_url}" \
	-H "Content-Type: application/json" \
	-d @src/proposal-created.fixture.json
