# Create the Storage Bucket for the Cloud Function source code
resource "google_storage_bucket" "watchdog_notifications_function" {
  project                     = module.governance_watchdog.project_id
  name                        = "${module.governance_watchdog.project_id}-watchdog-cloud-function" # Every bucket name must be globally unique
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  versioning {
    enabled = true
  }
  logging {
    log_bucket = google_storage_bucket.logging.id
  }

  force_destroy = true
}

# Zip the Cloud Function source code
data "archive_file" "function_source" {
  type        = "zip"
  source_dir  = "${path.module}/.."
  output_path = "${path.module}/../function-source.zip"

  # Not sure if this is stricly necessary when defining a .gcloudignore file, but better safe than sorry
  excludes = [".env", ".env.example", ".env.yaml", ".git", ".gitignore", ".trunk", ".vscode", "deploy-via-gcloud.sh", "test-deployed-function.sh", "README.md", "dist", "commitlint.config.mjs", "eslint.config.mjs", "infra", "node_modules"]
}


# Upload the Cloud Function source code to the bucket
resource "google_storage_bucket_object" "source_code" {
  # The hashed filename is important for terraform to realize there's been a change. Otherwise `terraform apply` might not update the function although the source code has changed since last deploy.
  name   = "function-source-${data.archive_file.function_source.output_sha256}.zip"
  bucket = google_storage_bucket.watchdog_notifications_function.name
  source = data.archive_file.function_source.output_path
}

# Create the Storage Bucket for access logs
resource "google_storage_bucket" "logging" {
  #checkov:skip=CKV_GCP_62:The logging bucket can't log to itself (circular dependency)
  project                     = module.governance_watchdog.project_id
  name                        = "${module.governance_watchdog.project_id}-logging" # Every bucket name must be globally unique
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  force_destroy = true
}
