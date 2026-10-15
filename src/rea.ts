import { z } from "zod";
import { EvidenceSchema, type Evidence } from "./contracts.js";

/**
 * REA is a developer-side reverse-engineering MCP tool, not a clinical runtime.
 * This boundary accepts reviewed, synthetic-only analysis findings as evidence.
 * It does NOT execute REA, authorize reverse engineering, or validate claims.
 */
export const REAFindingSchema = z.object({
  investigationId: z.string().min(1),
  target: z.string().min(1),
  question: z.string().min(1),
  finding: z.string().min(1),
  sourceReference: z.string().min(1),
  observedAt: z.string().datetime(),
  synthetic: z.literal(true),
  authorizedForAnalysis: z.literal(true),
  reviewedBy: z.string().min(1)
});
export type REAFinding = z.infer<typeof REAFindingSchema>;

/** Maps an explicitly reviewed REA finding to a provenance record. */
export function attachREAFinding(input: unknown): Evidence {
  const f = REAFindingSchema.parse(input);
  return EvidenceSchema.parse({
    id: `rea:${f.investigationId}`,
    source: `REA developer investigation: ${f.target}; reference: ${f.sourceReference}; reviewed by: ${f.reviewedBy}`,
    capturedAt: f.observedAt,
    synthetic: true,
    summary: `Question: ${f.question}. Finding (unverified): ${f.finding}`,
    permissions: ["synthetic-evaluation-only", "manual-review-required"]
  });
}
