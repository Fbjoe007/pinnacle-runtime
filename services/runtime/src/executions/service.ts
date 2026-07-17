import { createExecution } from "@pinnacle/runtime-sdk";
import { executeFox } from "@pinnacle/fox";
import { LeadOrchestrationProcessor } from "./orchestrator.js";
import type { Ledger } from "@pinnacle/runtime-sdk";
import type { RuntimeExecution } from "./types.js";
import type { InboundJob } from "../core/types.js";

export interface RuntimeExecutionRequest {
  capability: string;
  input: unknown;
}

export interface RuntimeExecutionResponse {
  execution: RuntimeExecution;
  success: boolean;
  output?: unknown;
  error?: string;
}

export async function executeRuntime(
  ledger: Ledger,
  request: RuntimeExecutionRequest
): Promise<RuntimeExecutionResponse> {
  const execution: RuntimeExecution = {
    ...createExecution("tenant-test"),
    capability: request.capability
  };

  const startTime = new Date();

  // Explicitly catch and route our core orchestration runner locally
  if (request.capability === "lead_orchestration") {
    try {
      const processor = new LeadOrchestrationProcessor();
      const jobInput = request.input as InboundJob;
      const output = await processor.processJob(jobInput);
      const endTime = new Date();

      // Phase 1, Item 1: Construct the immutable CEO Trust Architecture Audit Payload
      const auditPayload = {
        executionId: execution.executionId,
        leadId: jobInput.id || "unknown",
        runtimeVersion: "1.0.0-foundation",
        validatorVersion: "2.0.0-alpha",
        validatorsExecuted: Object.keys(output.breakdown || {}),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        normalizedEvidence: output.breakdown,
        riskScore: output.totalScore,
        finalDecision: output.passed ? "PASS" : "FAIL",
        replayReference: `replay_${execution.executionId}`
      };

      // Safely write to the Postgres ledger layer (awaiting the async implementation safely)
      await (ledger.append({
        id: `evt_${Math.random().toString(36).substring(2, 15)}`,
        executionId: execution.executionId,
        eventType: "validator.lead_orchestration.completed",
        timestamp: endTime,
        payload: auditPayload
      }) as unknown as Promise<void>);

      return {
        execution,
        success: true,
        output
      };
    } catch (err: any) {
      const endTime = new Date();
      
      // Log failure events to the ledger for total operational visibility
      await (ledger.append({
        id: `evt_${Math.random().toString(36).substring(2, 15)}`,
        executionId: execution.executionId,
        eventType: "validator.lead_orchestration.failed",
        timestamp: endTime,
        payload: {
          executionId: execution.executionId,
          error: err.message || "Lead Orchestration Internal Exception",
          timestamp: endTime.toISOString()
        }
      }) as unknown as Promise<void>);

      return {
        execution,
        success: false,
        error: err.message || "Lead Orchestration Internal Exception"
      };
    }
  }

  // Fallback to the legacy Fox capability pipeline
  const result = await executeFox({
    capability: request.capability,
    input: request.input
  });

  return {
    execution,
    success: result.success,
    output: result.output,
    error: result.error
  };
}
