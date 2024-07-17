terraform {
  required_version = ">= 1.8"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.36.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.4.2"
    }
    quicknode = {
      source  = "jmtx1020/quicknode"
      version = "0.0.2"
    }
  }

  backend "gcs" {
    bucket = "governance-watchdog-terraform-state-8020"
  }
}

module "bootstrap" {
  source               = "git::https://github.com/terraform-google-modules/terraform-google-bootstrap.git?ref=177e6be173eb8451155a133f7c6a591215130aab" # commit hash of v8.0.0
  org_id               = var.org_id
  project_id           = var.project_name
  default_region       = var.region
  billing_account      = var.billing_account
  group_org_admins     = var.group_org_admins
  group_billing_admins = var.group_billing_admins
  state_bucket_name    = "${var.project_name}-terraform-state"
  force_destroy        = true

  activate_apis = [
    # Required by the bootstrap module https://github.com/terraform-google-modules/terraform-google-bootstrap?tab=readme-ov-file#apis
    "cloudresourcemanager.googleapis.com",
    "cloudbilling.googleapis.com",
    "iam.googleapis.com",
    "storage-api.googleapis.com",
    "serviceusage.googleapis.com",

    # Required for our Cloud Function
    "cloudbuild.googleapis.com",
    "cloudfunctions.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
  ]
}

# This shouldn't be necessary as it's part of the bootstrap module, but for some reason it doesn't work without it
resource "google_billing_project_info" "default" {
  project         = module.bootstrap.seed_project_id
  billing_account = var.billing_account
}
