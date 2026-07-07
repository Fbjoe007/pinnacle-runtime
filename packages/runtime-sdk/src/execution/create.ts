import type { Execution, ExecutionId } from "./types.js";

function generateExecutionId(): ExecutionId {
  return crypto.randomUUID();
}

export function createExecution(
  tenantId: string
): Execution {

  return {
    executionId: generateExecutionId(),
    tenantId,
    state: "CREATED",
    createdAt: new Date()
  };

}
