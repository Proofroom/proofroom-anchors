# Action Receipt open format 1.2

Backwards compatible with 1.1 readers: unknown fields may be ignored.
Writers minting new receipts should set `schema_version` to `"1.2"`.

| Field | Notes |
| --- | --- |
| `schema_version` | Const `"1.2"` |
| (all 1.1 fields) | Unchanged |
| `authorization` | Optional. Summary of an authorisation credential attachment. |

## `authorization` (optional)

| Field | Notes |
| --- | --- |
| `protocol` | `"x401"` or `"other"` |
| `signature_status` | `not_checked` \| `signature_valid` \| `signature_invalid` \| `unsupported_format` |
| `issuer` | Optional claim-level hint only |

This block is an **attachment**, not a fourth evidence level. Evidence levels
remain exactly three: `self_reported`, `system_confirmed`,
`operator_confirmed`.

An authorisation credential attached to a receipt is evidence that a
credential was presented, and where stated, that its signature was checked.
It does not confirm the identity behind it, the issuer's trustworthiness, or
that the authorisation was appropriate.

See https://proofroom.ai/docs/authorisation-evidence
