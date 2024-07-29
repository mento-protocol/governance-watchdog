resource "google_logging_metric" "health_check_metric" {
  project     = module.bootstrap.seed_project_id
  name        = "healthcheck_logs_count"
  description = "Number of log entries containing 'health check' in the watchdog cloud function"
  filter      = <<EOF
    severity=DEFAULT
    SEARCH("`[HealthCheck]`")
    resource.labels.service_name="${google_cloudfunctions2_function.watchdog_notifications.name}"
  EOF
}
