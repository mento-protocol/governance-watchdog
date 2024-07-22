import { JSONSchemaType, envSchema } from "env-schema";

export interface Env {
  GCP_PROJECT_ID: string;
  DISCORD_WEBHOOK_URL_SECRET_ID: string;
  TELEGRAM_BOT_TOKEN_SECRET_ID: string;
  TELEGRAM_CHAT_ID: string;
}

const schema: JSONSchemaType<Env> = {
  type: "object",
  required: [
    "GCP_PROJECT_ID",
    "DISCORD_WEBHOOK_URL_SECRET_ID",
    "TELEGRAM_BOT_TOKEN_SECRET_ID",
    "TELEGRAM_CHAT_ID",
  ],
  properties: {
    GCP_PROJECT_ID: { type: "string" },
    DISCORD_WEBHOOK_URL_SECRET_ID: { type: "string" },
    TELEGRAM_BOT_TOKEN_SECRET_ID: { type: "string" },
    TELEGRAM_CHAT_ID: { type: "string" },
  },
};

export const config = envSchema({
  schema,
  dotenv: true, // load .env if it is there
});

export default config;
