import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "./config.js";

/**
 * Get the Discord webhook URL from GCloud Secret Manager. When ran locally, it assumes that the user is
 * authenticated in the gcloud cli and has the necessary permissions to access the secret.
 */
export default async function getDiscordWebhookUrl(): Promise<string> {
  const secretManager = new SecretManagerServiceClient();
  const secretFullResourceName = `projects/${config.GCP_PROJECT_ID}/secrets/${config.DISCORD_WEBHOOK_URL_SECRET_ID}/versions/latest`;
  const [version] = await secretManager.accessSecretVersion({
    name: secretFullResourceName,
  });

  const webhookUrl = version.payload?.data?.toString();

  if (!webhookUrl) {
    throw new Error(
      "Failed to retrieve discord webhook url from secret manager",
    );
  }

  return webhookUrl;
}
