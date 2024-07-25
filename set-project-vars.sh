#!/bin/bash
set -e          # Fail on any error
set -o pipefail # Ensure piped commands propagate exit codes properly
set -u          # Treat unset variables as an error when substituting

printf "Looking up project name in variables.tf..."
project_name=$(awk '/variable "project_name"/{f=1} f==1&&/default/{print $3; exit}' ./infra/variables.tf | tr -d '",')
printf ' \033[1m%s\033[0m\n' "${project_name}"

printf "Looking up region in variables.tf..."
region=$(awk '/variable "region"/{f=1} f==1&&/default/{print $3; exit}' ./infra/variables.tf | tr -d '",')
printf ' \033[1m%s\033[0m\n' "${region}"

current_local_project_id=$(gcloud config get project)

if [[ ! ${current_local_project_id} =~ ${project_name} ]]; then
	printf '️\n🚨 Your local gcloud is set to the wrong project: \033[1m%s\033[0m 🚨\n' "${current_local_project_id}"
	printf "\nRunning ./set-project-id.sh in an attempt to fix this...\n\n"
	source ./set-project-id.sh
	printf "\n\n"
else
	printf "Looking up the project ID..."
	project_id=$(gcloud config get project)
	printf ' \033[1m%s\033[0m\n' "${project_id}"
fi

printf "Looking up function name..."
function_name=$(gcloud functions list --format="value(name)")
printf ' \033[1m%s\033[0m\n' "${function_name}"
