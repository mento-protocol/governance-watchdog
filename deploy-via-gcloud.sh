#!/bin/bash
set -e          # Fail on any error
set -o pipefail # Ensure piped commands propagate exit codes properly
set -u          # Treat unset variables as an error when substituting

# Load the project variables
source ./set-project-vars.sh

printf "Looking up entry point..."
entry_point=$(gcloud functions describe "${function_name}" --region="${region}" --format json | jq .buildConfig.entryPoint)
printf ' \033[1m%s\033[0m\n' "${entry_point}"

printf "Looking up service account for function..."
service_account_email=$(gcloud functions describe "${function_name}" --region="${region}" --format="value(serviceConfig.serviceAccountEmail)")
printf ' \033[1m%s\033[0m\n' "${service_account_email}"

echo "Deploying to Google Cloud Functions..."
gcloud functions deploy "${function_name}" \
	--allow-unauthenticated \
	--entry-point "${entry_point}" \
	--gen2 \
	--project "${project_id}" \
	--region "${region}" \
	--runtime nodejs20 \
	--service-account "${service_account_email}" \
	--source . \
	--trigger-http

echo "✅ All Done!"
