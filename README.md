# proofroom-anchors

Public chain-head anchor manifests for [Proofroom](https://proofroom.ai).

This repository contains **manifests only**: no product code, no customer free text, no use-case UUIDs.

- Daily files: `anchors/YYYY/MM/DD.json`
- Rolling tip: `anchors/latest.json`
- OpenTimestamps proofs: `anchors/YYYY/MM/DD.ots` (when calendars are reachable)
- Open Action Receipt schemas: `schema/` (1.0, 1.1, 1.2; app mints 1.2 with optional `authorization` attachment summary)

Subjects are SHA-256 digests of each proof room's public id (slug). Public rooms may also list the slug in plain text. Private and unclaimed rooms never appear by name.

Verification guide: https://proofroom.ai/verify