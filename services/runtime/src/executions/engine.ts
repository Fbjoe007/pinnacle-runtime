import { 
  type Ledger, 
  type Execution, 
  type ExecutionState,
  validateStateTransition 
} from "@pinnacle/runtime-sdk";
import crypto from "crypto";

export interface CapabilityRequest {
  capability: string;
  input: unknown;
}

export interface CapabilityResult {
  success: boolean;
  output?: unknown;
  error?: string;
}

export interface RuntimeEngineConfig {
  ledger: Ledger;
  invokeCapability: (request: CapabilityRequest) => Promise<CapabilityResult>;
}

export class RuntimeExecutionEngine {
  constructor(private readonly config: RuntimeEngineConfig) {}

  async execute(tenantId: string, request: CapabilityRequest): Promise<Execution> {
    const executionId = crypto.randomUUID();
    
    let execution: Execution = {
      executionId,
      tenantId,
      state: "CREATED",
      createdAt: new Date()
    };

    await this.config.ledger.append({
      id: crypto.randomUUID(),
      executionId,
      eventType: "EXECUTION_CREATED",
      timestamp: new Date(),
      payload: { intent: request }
    });

    try {
      execution = await this.transitionTo(execution, "RUNNING", { dispatchedAt: new Date() });

      const result = await this.config.invokeCapability(request);

      if (result.success) {
        execution = await this.transitionTo(execution, "SUCCEEDED", { output: result.output });
      } else {
        execution = await this.transitionTo(execution, "FAILED", { error: result.error || "Unknown execution fault" });
      }
    } catch (error: any) {
      if (execution.state !== "SUCCEEDED" && execution.state !== "FAILED") {
        try {
          execution = await this.transitionTo(execution, "FAILED", { error: error.message || "Internal engine crash" });
        } catch {
          // Suppress fallback transition faults to preserve original context
        }
      }
      throw error;
    }

    return execution;
  }

  private async transitionTo(
    current: Execution, 
    nextState: ExecutionState, 
    evidencePayload: unknown
  ): Promise<Execution> {
    validateStateTransition(current.state, nextState, {
      executionId: current.executionId,
      authorityReference: `engine-signature-${nextState.toLowerCase()}`,
      evidenceRequired: ["ledger_payload"]
    });

    const updatedExecution: Execution = {
      ...current,
      state: nextState
    };

    await this.config.ledger.append({
      id: crypto.randomUUID(),
      executionId: current.executionId,
      eventType: `EXECUTION_${nextState}`,
      timestamp: new Date(),
      payload: evidencePayload
    });

    return updatedExecution;
  }
}
