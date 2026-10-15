import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { evaluate_market_scenario, evaluate_payment_integrity_case, simulate_episode } from "./tools.js";

const server = new McpServer({ name: "githealth-synthetic-evaluation", version: "0.1.0" });
server.tool("evaluate_market_scenario", "Synthetic-only market arithmetic, not reimbursement or guaranteed ROI", {
  scenarioId: z.string(), synthetic: z.literal(true), sites: z.number().int().positive(),
  monthlyFee: z.number().nonnegative(), annualOperatingCost: z.number().nonnegative()
}, async input => ({ content: [{ type: "text", text: JSON.stringify(evaluate_market_scenario(input)) }] }));
server.tool("evaluate_payment_integrity_case", "Synthetic-only payment variance triage, not a fraud determination", {
  caseId: z.string(), synthetic: z.literal(true), claimedAmount: z.number().nonnegative(),
  documentedAmount: z.number().nonnegative(), evidenceComplete: z.boolean()
}, async input => ({ content: [{ type: "text", text: JSON.stringify(evaluate_payment_integrity_case(input)) }] }));
server.tool("simulate_episode", "Synthetic episode policy evaluation; never authorizes real clinical execution", {
  scenario: z.object({
    id: z.string(), kind: z.enum(["market", "payment-integrity", "episode"]),
    synthetic: z.literal(true), facts: z.record(z.unknown()),
    evidence: z.array(z.object({
      id: z.string(), source: z.string(), capturedAt: z.string(),
      synthetic: z.literal(true), summary: z.string(),
      permissions: z.array(z.string()).optional()
    })).optional()
  }),
  policy: z.object({
    id: z.string(), version: z.string(), requiredEvidence: z.array(z.string()),
    consequential: z.boolean(), authorizedRoles: z.array(z.string())
  })
}, async input => ({ content: [{ type: "text", text: JSON.stringify(simulate_episode(input)) }] }));
await server.connect(new StdioServerTransport());
