import type { ExecutionState } from "./types.js";

const allowedTransitions: Record<
  ExecutionState,
  ExecutionState[]
> = {
  CREATED: ["RUNNING", "CANCELLED"],
  RUNNING: ["SUCCEEDED", "FAILED", "CANCELLED"],
  SUCCEEDED: [],
  FAILED: [],
  CANCELLED: []
};

export function canTransition(
  from: ExecutionState,
  to: ExecutionState
): boolean {
  return allowedTransitions[from].includes(to);
}
