import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "./config.js";

/**
 * Get the Telegram Bot Token from GCloud Secret Manager
 *
 * NOTE: This will fail locally because the local function will lack the necessary permissions to access the secret.
 * That's why read the webhook URL from our .env file when running locally. We could probably make it work by having
 * the local function impersonate the service account used by the function in GCP, but that was a rabbit hole I didn't
 * want to go down when a simple .env approach also works for local testing.
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
