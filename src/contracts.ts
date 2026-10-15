import { z } from "zod";

export const EvidenceSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  capturedAt: z.string().datetime(),
  synthetic: z.literal(true),
  summary: z.string().min(1),
  permissions: z.array(z.string()).default([])
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const CaseSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["market", "payment-integrity", "episode"]),
  synthetic: z.literal(true),
  facts: z.record(z.unknown()),
  evidence: z.array(EvidenceSchema).default([])
});
export type Case = z.infer<typeof CaseSchema>;

export const PolicySchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  requiredEvidence: z.array(z.string()),
  consequential: z.boolean(),
  authorizedRoles: z.array(z.string()).min(1)
});
export type Policy = z.infer<typeof PolicySchema>;

export const DecisionSchema = z.object({
  caseId: z.string(),
  policyId: z.string(),
  policyVersion: z.string(),
  state: z.enum(["blocked", "awaiting-human", "approved-for-simulation"]),
  reasons: z.array(z.string()),
  evidenceIds: z.array(z.string()),
  approval: z.object({ reviewerId: z.string(), role: z.string(), approvedAt: z.string().datetime() }).optional(),
  synthetic: z.literal(true)
});
export type Decision = z.infer<typeof DecisionSchema>;

export type Agent<I, O> = {
  name: string;
  run(input: I): Promise<O>;
};
export function defineAgent<I, O>(agent: Agent<I, O>): Agent<I, O> {
  if (!agent.name.trim()) throw new Error("Agent name required");
  return agent;
}

export interface MCPConnector {
  name: string;
  invoke(tool: string, input: unknown): Promise<unknown>;
}
export function connectMCP(connector: MCPConnector): MCPConnector {
  if (!connector.name) throw new Error("Named connector required");
  return connector;
}

export function attachEvidence(record: Case, evidence: Evidence): Case {
  return CaseSchema.parse({ ...record, evidence: [...record.evidence, EvidenceSchema.parse(evidence)] });
}
