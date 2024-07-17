#! /bin/bash
set -e          # fail on any error
set -o pipefail # ensure non-zero exit codes are propagated in piped commands

entry_point="watchdogNotifier"
function_name="watchdog-notifications"
region="watchdog-notifications"

echo "Generating temporary .env.yaml..."
npm run generate:dotenv:yaml

echo "Looking up service account for function..."
service_account=$(gcloud functions describe "${function_name}" --region="${region}" --format="value(serviceConfig.serviceAccountEmail)")

echo "Deploying to Google Cloud Functions..."
gcloud functions deploy "${function_name}" \
	--allow-unauthenticated \
	--entry-point "${entry_point}" \
	--env-vars-file .env.yaml \
	--gen2 \
	--region "${region}" \
	--runtime nodejs20 \
	--service-account "${service_account}" \
	--source . \
	--trigger-http

echo "Cleaning up temporary .env.yaml..."
rm .env.yaml

echo "✅ All Done!"
