import { JSONSchemaType, envSchema } from "env-schema";

interface Env {
  DISCORD_WEBHOOK_URL?: string;
  GCP_PROJECT_ID: string;
  SECRET_NAME: string;
}

const schema: JSONSchemaType<Env> = {
  type: "object",
  required: ["GCP_PROJECT_ID", "SECRET_NAME"],
  properties: {
    DISCORD_WEBHOOK_URL: { type: "string", nullable: true },
    GCP_PROJECT_ID: { type: "string" },
    SECRET_NAME: { type: "string" },
  },
};

export const config = envSchema({
  schema,
  dotenv: true, // load .env if it is there
});

export default config;
