import { validateDns } from "../validators/dns.validator.js";
import { validateTls } from "../validators/tls.validator.js";
import { validateGooglePlaces } from "../validators/google-places.validator.js";
import type { InboundJob, LeadValidationResult, ValidatorResult } from "../core/types.js";

export class LeadOrchestrationProcessor {
  async processJob(job: InboundJob): Promise<LeadValidationResult> {
    const processedAt = new Date().toISOString();

    // Fire all three validation checks in parallel for maximum performance
    const [dnsSettled, tlsSettled, googleSettled] = await Promise.allSettled([
      validateDns(job.domain),
      validateTls(job.domain),
      validateGooglePlaces(job.businessName, job.locationHint)
    ]);

    const breakdown: Record<string, ValidatorResult> = {};

    // 1. Process DNS Results
    if (dnsSettled.status === "fulfilled") {
      breakdown.dns_validator = dnsSettled.value;
    } else {
      breakdown.dns_validator = this.createFallbackResult("dns_validator", 30, dnsSettled.reason);
    }

    // 2. Process TLS Results
    if (tlsSettled.status === "fulfilled") {
      breakdown.tls_validator = tlsSettled.value;
    } else {
      breakdown.tls_validator = this.createFallbackResult("tls_validator", 30, tlsSettled.reason);
    }

    // 3. Process Google Places Results
    if (googleSettled.status === "fulfilled") {
      breakdown.google_places_validator = googleSettled.value;
    } else {
      breakdown.google_places_validator = this.createFallbackResult("google_places_validator", 40, googleSettled.reason);
    }

    // Aggregate point values (Max combined score = 100)
    let totalScore = 0;
    let maxScore = 0;

    for (const key of Object.keys(breakdown)) {
      totalScore += breakdown[key].score;
      maxScore += breakdown[key].maxScore;
    }

    // Lead passes if it achieves a baseline threshold of 50 total validation points
    const passed = totalScore >= 50;

    return {
      jobId: job.id,
      domain: job.domain,
      passed,
      totalScore,
      maxScore,
      breakdown,
      processedAt
    };
  }

  private createFallbackResult(name: string, maxScore: number, reason: any): ValidatorResult {
    const timestamp = new Date().toISOString();
    return {
      validator: name,
      passed: false,
      status: "failed",
      confidence: 0.0,
      score: 0,
      maxScore,
      evidence: [],
      warnings: [`Internal runner breakdown: ${String(reason)}`],
      execution_ms: 0,
      started_at: timestamp,
      finished_at: timestamp
    };
  }
}
