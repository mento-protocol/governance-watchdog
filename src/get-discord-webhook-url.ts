import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "./config.js";

/**
 * Get the Discord webhook URL from GCloud Secret Manager
 *
 * NOTE: This will fail locally because the local function will lack the necessary permissions to access the secret.
 * That's why read the webhook URL from our .env file when running locally. We could probably make it work by having
 * the local function impersonate the service account used by the function in GCP, but that was a rabbit hole I didn't
 * want to go down when a simple .env approach also works for local testing.
 */
export default async function getDiscordWebhookUrl(): Promise<string> {
  if (process.env.NODE_ENV === "development") {
    const localWebhookUrl = config.DISCORD_WEBHOOK_URL;

    if (!localWebhookUrl) {
      throw new Error(
        "Couldn't find DISCORD_WEBHOOK_URL in environment variables. Please set it in your .env file.",
      );
    }

    return localWebhookUrl;
  }

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
