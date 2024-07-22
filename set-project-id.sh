#! /bin/bash
set -e          # fail on any error
set -o pipefail # ensure non-zero exit codes are propagated in piped commands

# Get the project ID for the governance-watchdog project
printf "Fetching the project ID for the governance-watchdog project:"
project_id=$(gcloud projects list --filter="name:governance-watchdog" --format="value(projectId)")
printf ' \033[1m%s\033[0m\n' "${project_id}"

# Set your local default project to the governance-watchdog project
echo "Setting your default project to '${project_id}'..."
gcloud config set project "${project_id}"

# Set the quota project to the governance-watchdog project, some gcloud commands require this to be set
echo "Setting the quota project to '${project_id}'..."
gcloud auth application-default set-quota-project "${project_id}"

# Update the project ID in your .env file so your cloud function points to the correct project when running locally
printf "\n\nUpdating the project ID in your .env file..."
sed -i '' "s/^GCP_PROJECT_ID=.*/GCP_PROJECT_ID=${project_id}/" .env

printf "\n\n✅ All Done!"
exit 0
