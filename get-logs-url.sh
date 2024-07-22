#!/bin/bash
set -e          # fail on any error
set -o pipefail # ensure non-zero exit codes are propagated in piped commands

project_id=$(gcloud config get-value project)
region=europe-west1
function_name=watchdog-notifications
echo "https://console.cloud.google.com/functions/details/${region}/${function_name}?project=${project_id}&tab=logs "
