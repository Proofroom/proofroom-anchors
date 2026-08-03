# Action Receipt format 1.1

Backwards-compatible revision of 1.0. Readers that understand 1.0 may ignore
unknown fields. Writers minting new receipts should set `schema_version` to
`"1.1"`.

## Changes from 1.0

| Field | Change |
| --- | --- |
| `schema_version` | Const `"1.1"` |
| `scope_version` | Optional integer â‰¥ 1. Scope commitment version in force when the receipt was minted. Authority status is judged against that version and is never re-graded when scope later amends. |

See also [Scope and drift](/docs/scope-and-drift) and the JSON Schema
`schema/action-receipt-1.1.json`.
