import { Case, Decision, DecisionSchema, Policy } from "./contracts.js";

export function evaluatePolicy(record: Case, policy: Policy): Decision {
  const evidenceIds = record.evidence.map(e => e.id);
  const reasons: string[] = [];
  if (!record.synthetic || record.evidence.some(e => !e.synthetic)) reasons.push("Non-synthetic data prohibited");
  if (new Set(evidenceIds).size !== evidenceIds.length) reasons.push("Duplicate evidence identifiers");
  for (const required of policy.requiredEvidence) {
    if (!evidenceIds.includes(required)) reasons.push(`Missing evidence: ${required}`);
  }
  const state = reasons.length ? "blocked" : policy.consequential ? "awaiting-human" : "approved-for-simulation";
  return DecisionSchema.parse({
    caseId: record.id, policyId: policy.id, policyVersion: policy.version,
    state, reasons, evidenceIds, synthetic: true
  });
}

export function requireHumanApproval(
  decision: Decision,
  policy: Policy,
  reviewer: { id: string; role: string },
  approvedAt: string
): Decision {
  if (decision.state !== "awaiting-human") throw new Error("Decision is not awaiting approval");
  if (decision.policyId !== policy.id || decision.policyVersion !== policy.version) throw new Error("Policy version mismatch");
  if (!policy.authorizedRoles.includes(reviewer.role)) throw new Error("Reviewer role not authorized");
  if (!reviewer.id.trim()) throw new Error("Reviewer identity required");
  return DecisionSchema.parse({
    ...decision, state: "approved-for-simulation",
    approval: { reviewerId: reviewer.id, role: reviewer.role, approvedAt }
  });
}
