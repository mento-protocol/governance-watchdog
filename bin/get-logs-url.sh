#!/bin/bash
set -e          # Fail on any error
set -o pipefail # Ensure piped commands propagate exit codes properly
set -u          # Treat unset variables as an error when substituting

# Prints the log explorer URL for the Cloud Function and displays it in the terminal.
get_function_logs_url() {
	# Load the project variables
	script_dir=$(dirname "$0")
	source "${script_dir}/get-project-vars.sh"

	logs_url="https://console.cloud.google.com/functions/details/${region}/${function_name}?project=${project_id}&tab=logs "
	printf '\n\033[1m%s\033[0m\n' "${logs_url}"
}

get_function_logs_url "$@"
