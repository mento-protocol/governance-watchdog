#! /bin/bash
# This only works if the function has been deployed and your `terraform` can access the state backend

cd infra || exit
raw_function_url=$(terraform output -json function_uri)
function_url=$(echo "${raw_function_url}" | jq -r)

curl "${function_url}" \
	-H "Content-Type: application/json" \
	-d @src/proposal-created.fixture.json
