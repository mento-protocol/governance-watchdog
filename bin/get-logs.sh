#!/bin/bash
set -e          # Fail on any error
set -o pipefail # Ensure piped commands propagate exit codes properly
set -u          # Treat unset variables as an error when substituting

# Fetches the latest logs for the Cloud Function and displays them in the terminal.
get_function_logs() {
	# Load the project variables
	script_dir=$(dirname "$0")
	source "${script_dir}/get-project-vars.sh"

	printf "\n"
	echo "Fetching logs for function ${function_name} in region ${region}..."
	printf "\n"

	# Fetch raw logs
	raw_logs=$(gcloud functions logs read "${function_name}" \
		--region "${region}" \
		--project "${project_id}" \
		--format json \
		--limit 50 \
		--sort-by TIME_UTC)

	# Format logs
	echo "${raw_logs}" | jq -r '.[] | if .level == "E" then
  "\u001b[31m[\(.level)]\u001b[0m \u001b[33m\(.time_utc)\u001b[0m: \(.log)"
else
  "[\(.level)] \u001b[33m\(.time_utc)\u001b[0m: \(.log)"
end'
}

get_function_logs "$@"
