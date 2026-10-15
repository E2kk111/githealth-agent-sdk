# GitHealth Agent SDK™ — Developer Workshop v0.1

**Build healthcare AI agents. Test them against synthetic scenarios. Govern consequential actions.**

> **Experimental synthetic-only workshop.** Not clinically validated, HIPAA-certified, a medical device, or production-ready. No patient data, live clinical execution, payer action, or realized ROI.

## Quick start

Node.js 20+ required.

```bash
npm install
npm test
npm run example
npm run mcp
```

The MCP server uses stdio. Connect an MCP-compatible client to call the tools.

## Three MCP tools

| Tool | Purpose | Limit |
| --- | --- | --- |
| `evaluate_market_scenario` | Illustrative annual revenue/cost arithmetic | Not reimbursement or guaranteed ROI |
| `evaluate_payment_integrity_case` | Synthetic claim-documentation variance triage | Not fraud determination or payment action |
| `simulate_episode` | Synthetic episode policy evaluation | No autonomous clinical execution |

## Typed developer primitives

`defineAgent()`, `connectMCP()`, `attachEvidence()`, `evaluatePolicy()`, `requireHumanApproval()`, `runSimulation()`.

The example is in `src/example.ts`; tests are in `src/tests/workshop.test.ts`.

## Boundaries

- All case inputs are marked synthetic and parsed with typed schemas.
- Missing evidence and duplicate evidence identifiers block policy evaluation.
- Consequential simulated decisions require a reviewer record before advancing.
- **The reviewer role is only a supplied string.** No authentication, identity verification, actual clinician authorization, production policy approval, or secure audit storage exists.
- The connector interface does not establish tool trust, permission checks, or data rights.
- No AWS Bedrock, FHIR, EHR, or real payment integrations are connected.
- No open-source license is granted yet. Public source visibility does not itself grant permission to redistribute.

## Next milestones

Harden contracts and tool validation, add authenticated authorization and immutable audit design, add repeatable synthetic fixtures and approved policy versions, then consider optional model adapters and controlled enterprise pilots.

This is software packaging for the existing GitHealth / AION / SimLab architecture, not an additional commercial layer.
