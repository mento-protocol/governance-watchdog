import type { Request } from "@google-cloud/functions-framework";
import crypto from "crypto";
import config from "./config";
import getSecret from "./get-secret";

export async function isFromQuicknode(req: Request): Promise<boolean> {
  const quicknodeSecurityToken = await getSecret(
    config.QUICKNODE_SECURITY_TOKEN_SECRET_ID,
  );
  const givenSignature = req.headers["x-qn-signature"];
  const nonce = req.headers["x-qn-nonce"];
  const contentHash = req.headers["x-qn-content-hash"];
  const timestamp = req.headers["x-qn-timestamp"];

  const hmac = crypto.createHmac("sha256", quicknodeSecurityToken);
  hmac.update(`${nonce}${contentHash}${timestamp}`);

  const expectedSignature = hmac.digest("base64");

  return givenSignature === expectedSignature;
}

export async function hasAuthToken(req: Request): Promise<boolean> {
  const authToken = req.headers["x-auth-token"];
  const expectedAuthToken = await getSecret(config.X_AUTH_TOKEN_SECRET_ID);

  return authToken === expectedAuthToken;
}
