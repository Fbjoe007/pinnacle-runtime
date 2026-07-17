import { describe, test, expect } from "vitest";
import { LeadOrchestrationProcessor } from "../executions/orchestrator.js";
import type { InboundJob } from "../core/types.js";

describe("Lead Orchestration Processor: End-to-End Execution Pipeline", () => {
  test("Should successfully process an ideal lead with full passing score", async () => {
    const processor = new LeadOrchestrationProcessor();
    
    const validJob: InboundJob = {
      id: "job_01H6W4RA6K12BC34DE56FG78HI",
      domain: "google.com",
      businessName: "Google LLC",
      locationHint: "Mountain View, CA",
      status: "pending"
    };

    const result = await processor.processJob(validJob);

    expect(result.jobId).toBe(validJob.id);
    expect(result.domain).toBe(validJob.domain);
    expect(result.passed).toBe(true);
    expect(result.maxScore).toBe(100);
    expect(result.totalScore).toBeGreaterThanOrEqual(50);
    
    expect(result.breakdown).toHaveProperty("dns_validator");
    expect(result.breakdown).toHaveProperty("tls_validator");
    expect(result.breakdown).toHaveProperty("google_places_validator");

    expect(result.breakdown.dns_validator.maxScore).toBe(30);
    expect(result.breakdown.tls_validator.maxScore).toBe(30);
    expect(result.breakdown.google_places_validator.maxScore).toBe(40);
  });
});
