import { describe, test, expect } from "vitest";
import { SummaryEngine } from "./summary.engine.js";
import { RiskAssessment } from "../scoring/risk.types.js";

describe("Summary Engine Epic 7 Synthesis Test Suite", () => {
  const engine = new SummaryEngine();

  test("Test 1: Generates grounded, positive insights for HEALTHY profiles", () => {
    const assessment: RiskAssessment = {
      score: 100,
      rating: "HEALTHY",
      confidence: 1.0,
      findings: [],
      generatedAt: new Date().toISOString()
    };

    const summary = engine.generateSummary({ assessment, businessName: "Pinnacle Corp" });
    expect(summary.headline).toContain("Pinnacle Corp");
    expect(summary.headline).toContain("secure and verified");
    expect(summary.recommendedAction).toContain("No critical remediations required");
  });

  test("Test 2: Synthesizes cautionary gaps with explicit reasoning metrics", () => {
    const assessment: RiskAssessment = {
      score: 70,
      rating: "CAUTION",
      confidence: 1.0,
      findings: [{ severity: "WARN", reason: "DMARC record missing" }],
      generatedAt: new Date().toISOString()
    };

    const summary = engine.generateSummary({ assessment, businessName: "Caution Systems" });
    expect(summary.criticalImpact).toContain("risk score of 70");
    expect(summary.recommendedAction).toContain("DMARC record missing");
  });

  test("Test 3: Enforces immediate action directives on HIGH_RISK states", () => {
    const assessment: RiskAssessment = {
      score: 45,
      rating: "HIGH_RISK",
      confidence: 0.9,
      findings: [{ severity: "FAIL", reason: "Organization is explicitly marked as permanently closed" }],
      generatedAt: new Date().toISOString()
    };

    const summary = engine.generateSummary({ assessment, businessName: "Defunct LLC" });
    expect(summary.headline).toContain("High risk profile identified");
    expect(summary.recommendedAction).toContain("permanently closed");
  });
});