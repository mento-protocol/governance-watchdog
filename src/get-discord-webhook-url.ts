import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "./config.js";

/**
 * Get the Discord webhook URL from GCloud Secret Manager
 */
export default async function getDiscordWebhookUrl(): Promise<string> {
  const secretManager = new SecretManagerServiceClient();
  const [version] = await secretManager.accessSecretVersion({
    name: `projects/${config.GCP_PROJECT_ID}/secrets/${config.SECRET_NAME}/versions/latest`,
  });

  const webhookUrl = version.payload?.data?.toString();

  if (!webhookUrl) {
    throw new Error(
      "Failed to retrieve discord webhook url from secret manager",
    );
  }

  return webhookUrl;
}
