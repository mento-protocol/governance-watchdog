terraform {
  required_version = ">= 1.8"

  required_providers {
    restapi = {
      source  = "Mastercard/restapi"
      version = "~> 2.0.1"
    }
    google = {
      source  = "hashicorp/google"
      version = ">= 5.44.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.6.0"
    }
    local = {
      source  = "hashicorp/local"
      version = ">= 2.5.1"
    }
  }

  backend "gcs" {
    bucket                      = "mento-terraform-tfstate-6ed6"
    prefix                      = "governance-watchdog"
    impersonate_service_account = "org-terraform@mento-terraform-seed-ffac.iam.gserviceaccount.com"
  }
}

provider "google" {
  impersonate_service_account = var.terraform_service_account
}

# Configure the REST API provider for QuickNode
provider "restapi" {
  uri                  = "https://api.quicknode.com"
  write_returns_object = true

  headers = {
    "Content-Type" = "application/json"
    "x-api-key"    = var.quicknode_api_key
  }
}
