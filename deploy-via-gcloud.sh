#! /bin/bash
set -e          # fail on any error
set -o pipefail # ensure non-zero exit codes are propagated in piped commands

entry_point="watchdogNotifier"
function_name="watchdog-notifications"
region="europe-west1"

printf "Looking up function name..."
function_name=$(gcloud functions list --format="value(name)" | grep '^watchdog-notifications')
printf ' \033[1m%s\033[0m\n' "${function_name}"

printf "Looking up project ID..."
project_name="governance-watchdog"
project_id=$(gcloud projects list --filter="name:${project_name}*" --format="value(projectId)")
printf ' \033[1m%s\033[0m\n' "${project_id}"

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
