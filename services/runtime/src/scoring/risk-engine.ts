import { EvidenceItem } from "@pinnacle/validator-sdk";
import { RiskAssessment, RiskFinding } from "./risk.types.js";

export class RiskScoringEngine {
  public calculateRisk(evidence: EvidenceItem[]): RiskAssessment {
    let score = 0;
    const findings: RiskFinding[] = [];
    let totalConfidence = 0;

    // 1. DNS Infrastructure Scoring Segment (Max 30)
    const dnsResolution = evidence.find(e => e.claim === "dns_domain_resolves");
    const mxRecord = evidence.find(e => e.claim === "dns_mx_configured");
    const emailSecurity = evidence.find(e => e.claim === "dns_spf_dmarc_present");

    if (dnsResolution?.status === "PASS") score += 10;
    else findings.push({ severity: "FAIL", reason: "Domain fails to resolve under standard global lookup nameservers" });

    if (mxRecord?.status === "PASS") score += 10;
    else findings.push({ severity: "WARN", reason: "MX configuration invalid or unmapped for destination handling" });

    if (emailSecurity?.status === "PASS") score += 10;
    else findings.push({ severity: "WARN", reason: "Email fraud security matrix maps are missing SPF/DMARC protocols" });

    // 2. HTTPS Security Scoring Segment (Max 30)
    const httpsReachable = evidence.find(e => e.claim === "https_endpoint_reachable");
    const tlsValid = evidence.find(e => e.claim === "tls_certificate_valid");
    const redirectChain = evidence.find(e => e.claim === "redirect_chain_valid");

    if (httpsReachable?.status === "PASS") score += 10;
    else findings.push({ severity: "FAIL", reason: "Target endpoint failed to resolve an active HTTP/HTTPS transport session" });

    if (tlsValid?.status === "PASS") score += 10;
    else findings.push({ severity: "FAIL", reason: "TLS verification handshake failed or root validation chain broken" });

    if (redirectChain?.status === "PASS") score += 10;
    else findings.push({ severity: "WARN", reason: "Broken link configurations or unexpected loops discovered across redirects" });

    // 3. Business Identity Scoring Segment (Max 40)
    const bizExists = evidence.find(e => e.claim === "business_profile_exists");
    const bizOps = evidence.find(e => e.claim === "business_operational_status");
    const locVerified = evidence.find(e => e.claim === "business_location_verified");
    const webMatch = evidence.find(e => e.claim === "website_matches_business_profile");

    if (bizExists?.status === "PASS") score += 15;
    else findings.push({ severity: "FAIL", reason: "No real-world organization mapping discovered across localized registries" });

    if (bizOps?.status === "PASS") score += 15;
    else if (bizOps?.value === "CLOSED") findings.push({ severity: "FAIL", reason: "Organization is explicitly marked as permanently closed or defunct" });

    if (locVerified?.status === "PASS") score += 10;
    else findings.push({ severity: "WARN", reason: "Geographical locations or registered coordinate points do not match safely" });

    if (webMatch?.status === "WARN") findings.push({ severity: "WARN", reason: "Input domain does not match official registered identity parameters" });

    // Enforce lower bounds and upper caps
    score = Math.max(0, Math.min(100, score));

    // Assign rating categorizations cleanly
    let rating: "HEALTHY" | "CAUTION" | "HIGH_RISK" = "HIGH_RISK";
    if (score >= 90) rating = "HEALTHY";
    else if (score >= 70) rating = "CAUTION";

    // Calculate explicit average confidence dynamically across provided vectors
    if (evidence.length > 0) {
      const sum = evidence.reduce((acc, curr) => acc + (curr.confidence || 1.0), 0);
      totalConfidence = Number((sum / evidence.length).toFixed(2));
    } else {
      totalConfidence = 1.0;
    }

    return {
      score,
      rating,
      confidence: totalConfidence,
      findings,
      generatedAt: new Date().toISOString()
    };
  }
}