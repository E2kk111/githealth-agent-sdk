# REA developer-tool integration (opt-in)

GitHealth Agent SDK integrates **REA (Reverse Engineer Anything)** as an **optional developer investigation tool**, not a GitHealth clinical agent or a dependency of the runtime.

- Official website: https://rea.tools/
- Official source: https://github.com/morluto/rea
- REA license: MIT, with separate third-party license notices.
- REA is independently maintained; this is not an official partnership or endorsement.

## Why this exists

Developers can use REA to inspect **software they own or have permission to analyze**, such as an approved local reference application, then document how a feature behaves. A human reviewer can convert a *synthetic-only* REA investigation into GitHealth evidence through `attachREAFinding()`. The resulting evidence can be used in synthetic SimLab scenarios, but does **not** establish correctness, security, clinical validity or permission to reproduce proprietary software.

## Optional local setup (never automatic)

REA's published setup is:

```sh
npx rea-agents@latest setup
```

Review the setup plan before approving it, and restart the coding agent as instructed by REA. Follow the official REA installation guide and version requirements; REA is not installed by `npm install` for GitHealth.

Example coding-agent prompt:

> Use REA to inspect the calculation behavior of this locally owned, synthetic demonstration app. Record the precise source references, observed version, input/output examples and uncertainty. Do not inspect real patient records, live clinical systems or third-party software without authorization.

## Integration boundary

1. REA runs **in the developer's approved local environment** via its own MCP integration.
2. The developer reviews its observations and confirms the target is authorized and synthetic.
3. `attachREAFinding()` validates the developer-supplied record and converts it to an evidence object.
4. The evidence may be attached to a synthetic GitHealth case for policy evaluation or regression testing.
5. Consequential actions still require AION-style governance and simulated human review. There is no live execution.

### Example

```ts
import { attachREAFinding, attachEvidence } from "@githealth/agent-sdk";

const evidence = attachREAFinding({
  investigationId: "demo-calculation-v1",
  target: "owned-synthetic-calculator",
  question: "How does the calculation branch behave?",
  finding: "Reviewed illustrative calculation rule",
  sourceReference: "fixture://owned-demo/branch-1",
  observedAt: "2026-01-01T00:00:00.000Z",
  synthetic: true,
  authorizedForAnalysis: true,
  reviewedBy: "authorized-workshop-reviewer"
});
// attachEvidence(syntheticCase, evidence)
```

## Security and IP restrictions

- **No automatic REA installation, process execution, network observation or remote target analysis** is performed by the GitHealth SDK.
- No REA findings are accepted as real-world clinical evidence.
- Do not upload protected health information, credentials, patient records or confidential customer code to external analysis systems.
- Confirm software ownership, terms, licenses and explicit authorization before inspection or reconstruction.
- Reviewer identity and the `authorizedForAnalysis` flag are **developer-supplied strings/booleans**, not verified credentials or authorization. Production trust requires authenticated provenance and enforceable permissions.
- REA outputs and reverse-engineered code must be reviewed for intellectual property and third-party licensing before publication.

## Release validation

- Unit tests reject non-synthetic, unapproved or unreviewed investigation records.
- Test the optional REA MCP setup in a disposable developer environment with an owned synthetic target before claiming end-to-end integration.
- Document exact REA version, source digests and observed limitations in each actual investigation.
