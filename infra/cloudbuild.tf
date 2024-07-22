# Allows cloud build to do builds and write build logs.
resource "google_project_iam_member" "cloudbuild_builder" {
  project = module.bootstrap.seed_project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${module.bootstrap.terraform_sa_email}"
}

# Allows cloud build to access the function source code in the storage bucket
resource "google_storage_bucket_iam_member" "cloud_build_storage_access" {
  bucket = google_storage_bucket.watchdog_notifications_function.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${module.bootstrap.terraform_sa_email}"
}
