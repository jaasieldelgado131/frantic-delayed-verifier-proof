# Frantic delayed verifier proof

This repository contains the durable public artifact and evidence packet for
Frantic bounty #11, "Delayed verifier proof."

The public artifact is intentionally static. The evidence packet records only
timestamps returned by Frantic or committed by GitHub; it does not synthesize
browser-relative timestamps.

The `Delayed verifier` GitHub Actions workflow executes the blocking
`url.live` contract. A run before `run_after` records the real waiting state; a
separate run after the window records the post-window recheck.

## Public artifacts

- `public/artifact.json`: stable target for the delayed `url.live` check.
- `public/evidence.json`: verifier contract and observed timeline.
- `public/report.md`: concise human-readable status.

Claim: `frantic:claim:53b9035f-805c-44e5-a7cb-920ba6dd0b59`
