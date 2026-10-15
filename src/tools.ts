import { z } from "zod";
import { runSimulation, SimulationRequestSchema } from "./simlab.js";

const Money = z.number().finite().nonnegative();
const MarketInput = z.object({
  scenarioId: z.string().min(1), synthetic: z.literal(true),
  sites: z.number().int().positive(), monthlyFee: Money,
  annualOperatingCost: Money
});
const PaymentInput = z.object({
  caseId: z.string().min(1), synthetic: z.literal(true),
  claimedAmount: Money, documentedAmount: Money,
  evidenceComplete: z.boolean()
});

export function evaluate_market_scenario(input: unknown) {
  const data = MarketInput.parse(input);
  const annualRevenue = data.sites * data.monthlyFee * 12;
  return {
    scenarioId: data.scenarioId, synthetic: true as const,
    annualRevenue, annualOperatingCost: data.annualOperatingCost,
    illustrativeMargin: annualRevenue - data.annualOperatingCost,
    disclaimer: "Illustrative arithmetic only; not a reimbursement estimate or ROI guarantee."
  };
}
export function evaluate_payment_integrity_case(input: unknown) {
  const data = PaymentInput.parse(input);
  const difference = Math.max(0, data.claimedAmount - data.documentedAmount);
  return {
    caseId: data.caseId, synthetic: true as const, difference,
    state: data.evidenceComplete ? (difference > 0 ? "review-required" : "no-variance-detected") : "insufficient-evidence",
    authorizedPaymentAction: false as const,
    disclaimer: "Synthetic triage only; no fraud determination or payer action."
  };
}
export function simulate_episode(input: unknown) {
  return runSimulation(SimulationRequestSchema.parse(input));
}
export const TOOL_NAMES = ["evaluate_market_scenario", "evaluate_payment_integrity_case", "simulate_episode"] as const;
