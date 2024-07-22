variable "project_name" {
  type = string
  # Can be at most 26 characters long
  default = "governance-watchdog"
}

variable "region" {
  type    = string
  default = "europe-west1"
}

# You can find our org id via `gcloud organizations list`
variable "org_id" {
  type = string
}

# You can find the billing account via `gcloud billing accounts list` (pick the GmbH account)
variable "billing_account" {
  type = string
}

# You can find the org admins group via:
#  `gcloud organizations get-iam-policy <our-org-id> --format=json | jq -r '.bindings[] | select(.role | startswith("roles/resourcemanager.organizationAdmin"))  | .members[] | select(startswith("group:")) | sub("^group:"; "")'`
variable "group_org_admins" {
  type = string
}

# You can find the billing admins group via:
#  `gcloud organizations get-iam-policy <our-org-id> --format=json | jq -r '.bindings[] | select(.role | startswith("roles/billing.admin"))  | .members[] | select(startswith("group:")) | sub("^group:"; "")'`
variable "group_billing_admins" {
  type = string
}

# You can look this up either on the Discord Channel settings, or fetch it from Secret Manager via:
#  `gcloud secrets versions access latest --secret discord-webhook-url`
variable "discord_webhook_url" {
  type      = string
  sensitive = true
}

# You can create an API key via the QuickNode dashboard at https://dashboard.quicknode.com/api-keys
variable "quicknode_api_key" {
  type      = string
  sensitive = true
}
