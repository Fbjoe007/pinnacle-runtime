export type ExecutionId = string;

export type ExecutionState =
  | "CREATED"
  | "REQUESTED"
  | "AUTHORIZED"
  | "DISPATCHED"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";

export interface Execution {
  executionId: ExecutionId;
  tenantId: string;
  state: ExecutionState;
  createdAt: Date;
}
