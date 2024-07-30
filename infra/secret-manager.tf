# Creates a new secret for the Discord webhook URL.
# Terraform will try to look up the webhook URL from terraform.tfvars,
# and if it can't find it locally it will prompt the user to enter it manually.
resource "google_secret_manager_secret" "discord_webhook_url" {
  project   = module.bootstrap.seed_project_id
  secret_id = var.discord_webhook_url_secret_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "discord_webhook_url" {
  secret      = google_secret_manager_secret.discord_webhook_url.id
  secret_data = var.discord_webhook_url
}

# Creates a new secret for the Telegram Bot Token.
# Terraform will try to look up the webhook URL from terraform.tfvars,
# and if it can't find it locally it will prompt the user to enter it manually.
resource "google_secret_manager_secret" "telegram_bot_token" {
  project   = module.bootstrap.seed_project_id
  secret_id = var.telegram_bot_token_secret_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "telegram_bot_token" {
  secret      = google_secret_manager_secret.telegram_bot_token.id
  secret_data = var.telegram_bot_token
}
