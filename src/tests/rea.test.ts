import test from "node:test";
import assert from "node:assert/strict";
import { attachREAFinding } from "../rea.js";
const finding = {
  investigationId: "demo-1", target: "owned-demo-app", question: "How is a result computed?",
  finding: "An illustrative result is derived from a local fixture", sourceReference: "fixture://demo-1",
  observedAt: "2026-01-01T00:00:00.000Z", synthetic: true,
  authorizedForAnalysis: true, reviewedBy: "workshop-reviewer"
};
test("REA reviewed synthetic finding converts to evidence", () => {
  const evidence = attachREAFinding(finding);
  assert.equal(evidence.id, "rea:demo-1");
  assert.deepEqual(evidence.permissions, ["synthetic-evaluation-only", "manual-review-required"]);
});
test("REA rejects unapproved investigations", () => assert.throws(() => attachREAFinding({ ...finding, authorizedForAnalysis: false })));
test("REA rejects non-synthetic findings", () => assert.throws(() => attachREAFinding({ ...finding, synthetic: false })));
test("REA rejects findings without reviewer", () => assert.throws(() => attachREAFinding({ ...finding, reviewedBy: "" })));
