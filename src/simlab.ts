import { z } from "zod";
import { CaseSchema, PolicySchema } from "./contracts.js";
import { evaluatePolicy } from "./governance.js";

export const SimulationRequestSchema = z.object({
  scenario: CaseSchema,
  policy: PolicySchema
});
export function runSimulation(input: unknown) {
  const request = SimulationRequestSchema.parse(input);
  const decision = evaluatePolicy(request.scenario, request.policy);
  return {
    simulationId: `sim-${request.scenario.id}`,
    synthetic: true as const,
    decision,
    checks: {
      evidenceComplete: !decision.reasons.some(r => r.startsWith("Missing evidence")),
      policyPassed: decision.state !== "blocked",
      humanAuthorizationRequired: decision.state === "awaiting-human",
      autonomousClinicalExecution: false as const
    }
  };
}
