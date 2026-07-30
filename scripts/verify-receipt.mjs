#!/usr/bin/env node
/**
 * Offline Action Receipt signature verification.
 * Usage: node scripts/verify-receipt.mjs receipt.json key.json
 * No network calls. Exit 0 on success, 1 on failure.
 */
import { createPublicKey, verify, createHash } from "crypto";
import { readFileSync } from "fs";

function canonical(payload) {
  const keys = [
    "approval_status",
    "authority_status",
    "config_fingerprint",
    "evidence_level",
    "event_hash",
    "event_type",
    "receipt_id",
    "timestamp",
    "use_case_public_id",
  ].sort();
  const sorted = {};
  for (const key of keys) {
    sorted[key] = payload[key] ?? null;
  }
  return JSON.stringify(sorted);
}

function loadKey(doc, kid) {
  const keys = Array.isArray(doc.keys) ? doc.keys : [doc];
  const key = keys.find((k) => k.kid === kid) || keys[0];
  if (!key || !key.x) {
    throw new Error("Public key document has no usable Ed25519 key (missing x)");
  }
  return createPublicKey({
    key: { kty: "OKP", crv: "Ed25519", x: key.x },
    format: "jwk",
  });
}

const receiptPath = process.argv[2];
const keyPath = process.argv[3];
if (!receiptPath || !keyPath) {
  console.error("Usage: node scripts/verify-receipt.mjs receipt.json key.json");
  process.exit(2);
}
const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
const keyDoc = JSON.parse(readFileSync(keyPath, "utf8"));
if (!receipt.signature || !receipt.key_id) {
  console.error("Receipt missing signature or key_id");
  process.exit(1);
}
const payload = {
  receipt_id: receipt.receipt_id,
  use_case_public_id: receipt.use_case_public_id,
  event_type: receipt.event_type,
  authority_status: receipt.authority_status,
  evidence_level: receipt.evidence_level,
  approval_status: receipt.approval_status ?? "not_applicable",
  timestamp: receipt.timestamp,
  event_hash: receipt.event_hash,
  config_fingerprint: receipt.config_fingerprint ?? null,
};
const message = Buffer.from(canonical(payload), "utf8");
const pub = loadKey(keyDoc, receipt.key_id);
const ok = verify(null, message, pub, Buffer.from(receipt.signature, "base64"));
if (!ok) {
  console.error("INVALID signature");
  process.exit(1);
}
console.log("VALID");
console.log("key_id", receipt.key_id);
console.log("receipt_id", receipt.receipt_id);
console.log(
  "canonical_sha256",
  createHash("sha256").update(message).digest("hex").slice(0, 16) + "…"
);
console.log(
  "Honest limitation: A signature proves this receipt was issued by Proofroom and has not been altered since. It does not evidence that the underlying action occurred."
);
