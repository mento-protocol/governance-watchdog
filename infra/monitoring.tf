# Creates a metric that counts the number of log entries containing 'HealthCheck' in the watchdog cloud function.
resource "google_logging_metric" "health_check_metric" {
  project     = module.governance_watchdog.project_id
  name        = "health_check_logs_count"
  description = "Number of log entries containing 'health check' in the watchdog cloud function"
  filter      = <<EOF
    severity=DEFAULT
    SEARCH("`[HealthCheck]`")
    resource.labels.service_name="${google_cloudfunctions2_function.watchdog_notifications.name}"
  EOF
}

# Creates a notification channel where alerts will be sent based on the alert policy below.
resource "google_monitoring_notification_channel" "victorops_channel" {
  project      = module.governance_watchdog.project_id
  display_name = "Splunk (VictorOps)"
  type         = "webhook_tokenauth"

  labels = {
    url = var.victorops_webhook_url
  }
}

# Creates an alert policy that triggers when no health check logs have been received in the last 6 hours,
# and sends a notification to the channel above.
resource "google_monitoring_alert_policy" "health_check_policy" {
  project      = module.governance_watchdog.project_id
  display_name = "no-health-check-logs"
  combiner     = "OR"
  enabled      = true

  documentation {
    content = "No health check events have been logged in the last 6 hours"
  }

  conditions {
    display_name = "No health check logs in 6 hours"

    condition_threshold {
      filter = <<EOF
        resource.type = "cloud_run_revision" AND
        metric.type   = "logging.googleapis.com/user/${google_logging_metric.health_check_metric.name}"
      EOF

      duration        = "300s" # Re-test the condition every 5 minutes
      comparison      = "COMPARISON_LT"
      threshold_value = 1

      aggregations {
        alignment_period     = "21600s" # 6 hours
        per_series_aligner   = "ALIGN_SUM"
        cross_series_reducer = "REDUCE_SUM"
      }

      trigger {
        count = 1
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.victorops_channel.id]
  severity              = "CRITICAL"

  # This is a workaround to prevent the alert from being automatically closed after 7 days (even if still firing)
  alert_strategy {
    auto_close = "1800000s" # 20+ years, effectively never auto-close
  }
}
