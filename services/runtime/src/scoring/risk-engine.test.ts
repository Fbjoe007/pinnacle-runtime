import { describe, test, expect } from "vitest";
import { RiskScoringEngine } from "./risk-engine.js";
import { EvidenceItem } from "@pinnacle/validator-sdk";

describe("Risk Scoring Engine Epic 6 Deterministic Test Suite", () => {
  const engine = new RiskScoringEngine();

  const createMockEvidence = (claim: string, status: "PASS" | "WARN" | "FAIL", value: any = true): EvidenceItem => ({
    id: "ev_" + Math.random().toString(36).substring(2, 7),
    validator: "mock_validator",
    source: "mock_source",
    claim,
    value,
    confidence: 1.0,
    status,
    observedAt: new Date().toISOString(),
    metadata: {}
  });

  test("Test 1: Perfect Business Profiles return Score 100 & HEALTHY", () => {
    const perfectInput = [
      createMockEvidence("dns_domain_resolves", "PASS"),
      createMockEvidence("dns_mx_configured", "PASS"),
      createMockEvidence("dns_spf_dmarc_present", "PASS"),
      createMockEvidence("https_endpoint_reachable", "PASS"),
      createMockEvidence("tls_certificate_valid", "PASS"),
      createMockEvidence("redirect_chain_valid", "PASS"),
      createMockEvidence("business_profile_exists", "PASS"),
      createMockEvidence("business_operational_status", "PASS"),
      createMockEvidence("business_location_verified", "PASS"),
      createMockEvidence("website_matches_business_profile", "PASS")
    ];
    const assessment = engine.calculateRisk(perfectInput);
    expect(assessment.score).toBe(100);
    expect(assessment.rating).toBe("HEALTHY");
    expect(assessment.findings.length).toBe(0);
  });

  test("Test 2: Missing Security/Infrastructure Controls outputs CAUTION", () => {
    const insecureInput = [
      createMockEvidence("dns_domain_resolves", "PASS"),
      createMockEvidence("dns_mx_configured", "PASS"),
      createMockEvidence("dns_spf_dmarc_present", "FAIL"), // Fails email security (-10)
      createMockEvidence("https_endpoint_reachable", "PASS"),
      createMockEvidence("tls_certificate_valid", "PASS"),
      createMockEvidence("redirect_chain_valid", "PASS"),
      createMockEvidence("business_profile_exists", "PASS"),
      createMockEvidence("business_operational_status", "PASS"),
      createMockEvidence("business_location_verified", "PASS"),
      createMockEvidence("website_matches_business_profile", "PASS")
    ];
    const assessment = engine.calculateRisk(insecureInput);
    expect(assessment.score).toBe(90);
    expect(assessment.findings.length).toBe(1);
  });

  test("Test 3: Closed or defunct businesses fall straight to HIGH_RISK", () => {
    const closedInput = [
      createMockEvidence("dns_domain_resolves", "PASS"),
      createMockEvidence("business_profile_exists", "PASS"),
      createMockEvidence("business_operational_status", "FAIL", "CLOSED")
    ];
    const assessment = engine.calculateRisk(closedInput);
    expect(assessment.score).toBeLessThan(70);
    expect(assessment.rating).toBe("HIGH_RISK");
  });

  test("Test 4: Deterministic Replay consistency guarantees identical outcomes", () => {
    const staticInput = [
      createMockEvidence("dns_domain_resolves", "PASS"),
      createMockEvidence("https_endpoint_reachable", "FAIL"),
      createMockEvidence("business_profile_exists", "PASS")
    ];
    const executionOne = engine.calculateRisk(staticInput);
    const executionTwo = engine.calculateRisk(staticInput);
    
    expect(executionOne.score).toEqual(executionTwo.score);
    expect(executionOne.rating).toEqual(executionTwo.rating);
    expect(executionOne.findings.length).toEqual(executionTwo.findings.length);
  });
});