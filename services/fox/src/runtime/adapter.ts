import {
  createExecution,
  type Ledger
} from "@pinnacle/runtime-sdk";

import { executeFox } from "../executor.js";
import type {
  FoxRequest,
  FoxResponse
} from "../types.js";

export async function executeFoxRuntime(
  tenantId: string,
  request: FoxRequest,
  ledger: Ledger
): Promise<FoxResponse> {

  const execution = createExecution(tenantId);

  ledger.append({
    id: crypto.randomUUID(),
    executionId: execution.executionId,
    eventType: "FOX_EXECUTION_CREATED",
    timestamp: new Date(),
    payload: {
      capability: request.capability
    }
  });

  ledger.append({
    id: crypto.randomUUID(),
    executionId: execution.executionId,
    eventType: "AI_PROVIDER_SELECTED",
    timestamp: new Date(),
    payload: {
      provider: "vertex"
    }
  });

  ledger.append({
    id: crypto.randomUUID(),
    executionId: execution.executionId,
    eventType: "AI_REQUEST_STARTED",
    timestamp: new Date(),
    payload: {
      capability: request.capability
    }
  });

  const result = await executeFox(request);

  ledger.append({
    id: crypto.randomUUID(),
    executionId: execution.executionId,
    eventType: "AI_RESPONSE_RECEIVED",
    timestamp: new Date(),
    payload: result
  });

  ledger.append({
    id: crypto.randomUUID(),
    executionId: execution.executionId,
    eventType: result.success
      ? "FOX_EXECUTION_SUCCEEDED"
      : "FOX_EXECUTION_FAILED",
    timestamp: new Date(),
    payload: result
  });

  return result;
}
