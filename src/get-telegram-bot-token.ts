import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "./config.js";

/**
 * Get the Telegram Bot Token from GCloud Secret Manager. When ran locally, it assumes that the user is
 * authenticated in the gcloud cli and has the necessary permissions to access the secret.
 */
export default async function getTelegramBotToken(): Promise<string> {
  const secretManager = new SecretManagerServiceClient();
  const secretFullResourceName = `projects/${config.GCP_PROJECT_ID}/secrets/${config.TELEGRAM_BOT_TOKEN_SECRET_ID}/versions/latest`;
  const [version] = await secretManager.accessSecretVersion({
    name: secretFullResourceName,
  });

  const botToken = version.payload?.data?.toString();

  if (!botToken) {
    throw new Error(
      "Failed to retrieve telegram bot token from secret manager",
    );
  }

  return botToken;
}
