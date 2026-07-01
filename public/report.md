# Delayed verifier proof

Status: `delivery_prepared_waiting_for_frantic_server_verifier`

- Bounty: Frantic #11, `Delayed verifier proof`, $6.
- Claim: `frantic:claim:9c5e05ff-03d6-4d6b-a2d4-13b93590b551`.
- Public artifact: `https://raw.githubusercontent.com/jaasieldelgado131/frantic-delayed-verifier-proof/main/public/artifact.json`.
- Evidence JSON: `https://raw.githubusercontent.com/jaasieldelgado131/frantic-delayed-verifier-proof/main/public/evidence.json`.
- Source repository: `https://github.com/jaasieldelgado131/frantic-delayed-verifier-proof`.
- The fresh claim response included a non-null Frantic verification plan with six scheduled checks.
- Inline checks are expected to run at delivery time: `evidence_json_valid`, `evidence_items`, `artifact_summary`, `public_url_admitted`, and `report_depth`.
- The blocking delayed verifier check is `public_url_live`, scheduled for `2026-07-02T04:55:31.013Z`.
- `public_url_live` has `blocks_acceptance: true`, so final acceptance should wait for the Frantic server-side recheck after the not-before window.
- This report does not hand-author a passed delayed recheck. The post-window result must be emitted by Frantic's verifier.
- The final delivery receipt is pending until POST `/v1/deliveries` returns the real Frantic receipt ref; after that, the public evidence file can be updated to link the emitted receipt.
