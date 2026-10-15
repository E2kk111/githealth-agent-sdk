import { runSimulation } from "./index.js";
const result = runSimulation({
  scenario: {
    id: "synthetic-discharge-001", kind: "episode", synthetic: true,
    facts: { destination: "post-acute", dischargeReadiness: "unknown" },
    evidence: [{ id: "care-plan", source: "synthetic-fixture", capturedAt: "2026-01-01T00:00:00.000Z", synthetic: true, summary: "Simulated care plan", permissions: [] }]
  },
  policy: { id: "aion.discharge", version: "v0.1", requiredEvidence: ["care-plan"], consequential: true, authorizedRoles: ["licensed-clinician"] }
});
console.log(JSON.stringify(result, null, 2));
