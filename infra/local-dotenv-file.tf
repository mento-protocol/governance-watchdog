resource "local_file" "env_file" {
  filename = "${path.module}/../.env"
  content  = <<-EOT
    GCP_PROJECT_ID=${module.bootstrap.seed_project_id}
    DISCORD_WEBHOOK_URL_SECRET_ID=${var.discord_webhook_url_secret_id}
    TELEGRAM_BOT_TOKEN_SECRET_ID=${var.telegram_bot_token_secret_id}
    TELEGRAM_CHAT_ID=${var.telegram_chat_id}
    QUICKNODE_SECURITY_TOKEN_SECRET_ID=${var.quicknode_security_token_secret_id}
    X_AUTH_TOKEN_SECRET_ID=${var.x_auth_token_secret_id}
  EOT
}
