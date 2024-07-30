resource "local_file" "env_file" {
  filename = "${path.module}/../.env"
  content  = <<-EOT
    GCP_PROJECT_ID=${module.bootstrap.seed_project_id}
    DISCORD_WEBHOOK_URL_SECRET_ID=${var.discord_webhook_url_secret_id}
    TELEGRAM_BOT_TOKEN_SECRET_ID=${var.telegram_bot_token_secret_id}
    TELEGRAM_CHAT_ID=${var.telegram_chat_id}
  EOT
}
