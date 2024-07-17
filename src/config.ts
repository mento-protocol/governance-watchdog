import { JSONSchemaType, envSchema } from "env-schema";

interface Env {
  GCP_PROJECT_ID: string;
  SECRET_NAME: string;
}

const schema: JSONSchemaType<Env> = {
  type: "object",
  required: ["GCP_PROJECT_ID", "SECRET_NAME"],
  properties: {
    GCP_PROJECT_ID: { type: "string" },
    SECRET_NAME: { type: "string" },
  },
};

export const config = envSchema({
  schema,
  dotenv: true, // load .env if it is there
});

export default config;
