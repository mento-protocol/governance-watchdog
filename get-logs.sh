#!/bin/bash
set -e          # fail on any error
set -o pipefail # ensure non-zero exit codes are propagated in piped commands

# Get the name of the watchdog-notifications function
function_name=$(gcloud functions list --format="value(name)" | grep '^watchdog-notifications')

# Fetch raw logs
raw_logs=$(gcloud functions logs read "${function_name}" \
	--region europe-west1 \
	--format json \
	--sort-by TIME_UTC)

# Format logs
echo "${raw_logs}" | jq -r '.[] | if .level == "E" then
  "\u001b[31m[\(.level)]\u001b[0m \u001b[33m\(.time_utc)\u001b[0m: \(.log)"
else
  "[\(.level)] \u001b[33m\(.time_utc)\u001b[0m: \(.log)"
end'
