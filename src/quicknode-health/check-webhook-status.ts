import getSecret from "../utils/get-secret.js";

interface QuicknodeWebhook {
  id: string;
  name: string;
  status: string;
  network: string;
  created_at: string;
  updated_at: string;
}

interface QuicknodeWebhooksResponse {
  data: QuicknodeWebhook[];
}

interface WebhookStatus {
  name: string;
  status: string;
  isHealthy: boolean;
}

interface WebhookHealthResult {
  healthy: boolean;
  webhooks: WebhookStatus[];
  unhealthyWebhooks: string[];
}

const QUICKNODE_API_BASE_URL = "https://api.quicknode.com";
const HEALTHY_STATUSES = ["active"];

/**
 * Checks the health status of all QuickNode webhooks.
 * Returns information about each webhook's status and whether it's healthy.
 */
export const checkWebhookStatus = async (): Promise<WebhookHealthResult> => {
  const apiKey = await getSecret(
    process.env.QUICKNODE_API_KEY_SECRET_ID ?? "quicknode-api-key",
  );

  const response = await fetch(
    `${QUICKNODE_API_BASE_URL}/webhooks/rest/v1/webhooks`,
    {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `QuickNode API request failed: ${String(response.status)} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as QuicknodeWebhooksResponse;
  const webhooks = data.data;

  const webhookStatuses = webhooks.map((webhook) => ({
    name: webhook.name,
    status: webhook.status,
    isHealthy: HEALTHY_STATUSES.includes(webhook.status.toLowerCase()),
  }));

  const unhealthyWebhooks = webhookStatuses
    .filter((w) => !w.isHealthy)
    .map((w) => `${w.name} (${w.status})`);

  return {
    healthy: unhealthyWebhooks.length === 0,
    webhooks: webhookStatuses,
    unhealthyWebhooks,
  };
};
