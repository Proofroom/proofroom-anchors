# Action Receipt format 1.0

An open format for agent action receipts. Anyone may implement it, including
competitors. This document is not a standards-body standard and does not claim
adoption beyond Proofroom's own issuance.

Licence: MIT (schema and this specification).

## What a receipt is

A receipt is a small JSON document that names one material agent action, places
it in a declared use case, records an evidence level, and optionally carries a
signature and opaque lineage links. It is designed to be checked offline.

## Required fields

| Field | Meaning |
| --- | --- |
| `schema_version` | Always `"1.0"` for this revision. |
| `receipt_id` | Public code (Proofroom issues `PRF-#####`). |
| `use_case_public_id` | Public identifier of the use case. |
| `event_type` | Kind of action recorded. |
| `authority_status` | `in_scope`, `out_of_scope`, `undeclared`, or `not_applicable`. |
| `evidence_level` | Exactly one of: `self_reported`, `system_confirmed`, `operator_confirmed`. |
| `approval_status` | Approval state, or `not_applicable`. |
| `timestamp` | ISO-8601 time of the action or recording. |
| `event_hash` | 64-char lowercase hex SHA-256 of the sealed evidence event. |

## Optional fields

| Field | Meaning |
| --- | --- |
| `config_fingerprint` | Opaque configuration digest, or null. |
| `config_provenance_level` | How the fingerprint was declared. |
| `links` | Array of opaque lineage edges (see below). |
| `signature` | Ed25519 (`EdDSA`) signature block. |

## Evidence levels (1.0)

Only three levels exist in this version:

1. **self_reported** – the agent or host submitted the record.
2. **system_confirmed** – an independent system signal backs a reference.
3. **operator_confirmed** – a named human resolved an approval for the step.

Do not invent further levels in documents claiming schema_version 1.0.

## Lineage links

Each link has `to_ref_type`, `to_ref_id`, and `relation`. `to_ref_id` must be a
short opaque identifier or hash. Never put document bodies, prompts, or other
prose in `to_ref_id`.

## Signature block

When present, `signature` contains `alg` (`EdDSA`), `key_id`, and `value`
(base64). The signed bytes are the canonical JSON of the structural fields used
by the issuer (keys sorted, no whitespace). A valid signature shows the
document was issued by the holder of the key and was not altered since. It does
not evidence that the underlying action occurred.

## Worked example

```json
{
  "schema_version": "1.0",
  "receipt_id": "PRF-00042",
  "use_case_public_id": "example-support-triage",
  "event_type": "decision_made",
  "authority_status": "in_scope",
  "evidence_level": "self_reported",
  "approval_status": "not_applicable",
  "timestamp": "2026-08-02T10:15:00.000Z",
  "event_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "config_fingerprint": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "config_provenance_level": "computed",
  "links": [
    {
      "to_ref_type": "configuration",
      "to_ref_id": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "relation": "used"
    }
  ],
  "signature": {
    "alg": "EdDSA",
    "key_id": "prf-ed25519-default",
    "value": "BASE64_SIGNATURE_HERE"
  }
}
```

## Independent verification

See `scripts/verify-receipt.mjs` in the Proofroom application repository and
the copy published beside this schema in the public anchors repository.
