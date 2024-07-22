import type { Request } from "@google-cloud/functions-framework";
import crypto from "crypto";
import getQuicknodeSecurityToken from "./get-quicknode-security-token";

export default async function validateRequestOrigin(req: Request) {
  const quicknodeSecurityToken = await getQuicknodeSecurityToken();
  const givenSignature = req.headers["x-qn-signature"];
  const nonce = req.headers["x-qn-nonce"];
  const contentHash = req.headers["x-qn-content-hash"];
  const timestamp = req.headers["x-qn-timestamp"];

  if (!nonce || typeof nonce !== "string") {
    console.error("No valid quicknode nonce found in request headers:", nonce);
    return;
  }

  if (!contentHash || typeof contentHash !== "string") {
    console.error(
      "No valid quicknode content hash found in request headers:",
      contentHash,
    );
    return;
  }

  if (!timestamp || typeof timestamp !== "string") {
    console.error(
      "No valid quicknode timestamp found in request headers:",
      contentHash,
    );
    return;
  }

  const hmac = crypto.createHmac("sha256", quicknodeSecurityToken);
  hmac.update(`${nonce}${contentHash}${timestamp}`);

  const expectedSignature = hmac.digest("base64");

  if (givenSignature === expectedSignature) {
    console.log(
      "The signature given matches the expected signature and is valid.",
    );
    return;
  } else {
    throw new Error(
      "Signature validation failed for the request's Quicknode signature header",
    );
  }
}
