import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "../config.js";

/**
 * Singleton gRPC client — creating a new SecretManagerServiceClient per request
 * leaks gRPC channels and causes memory growth (~488 MiB OOM within 30 min).
 */
const secretManager = new SecretManagerServiceClient();

/**
 * In-memory cache for secrets. Secrets don't change during an instance's lifetime,
 * so we can safely cache them and avoid repeated Secret Manager round-trips.
 */
const secretCache = new Map<string, string>();

/**
 * Load a secret from Secret Manager (cached per instance lifetime)
 */
export default async function getSecret(secretId: string): Promise<string> {
  const cached = secretCache.get(secretId);
  if (cached) {
    return cached;
  }

  try {
    const secretFullResourceName = `projects/${config.GCP_PROJECT_ID}/secrets/${secretId}/versions/latest`;
    const [version] = await secretManager.accessSecretVersion({
      name: secretFullResourceName,
    });

    const secret = version.payload?.data?.toString();

    if (!secret) {
      throw new Error(
        `Secret '${secretId}' is empty or undefined. Please check the secret in Secret Manager.`,
      );
    }

    secretCache.set(secretId, secret);
    return secret;
  } catch (error) {
    console.error(
      `Failed to retrieve secret '${secretId}' from secret manager:`,
      error,
    );
    throw error;
  }
}
