import type { ExecutionState } from "./types.js";

export const allowedTransitions: Record<ExecutionState, ExecutionState[]> = {
  CREATED: ["RUNNING", "FAILED", "CANCELLED"],
  REQUESTED: ["AUTHORIZED", "FAILED", "CANCELLED"],
  AUTHORIZED: ["DISPATCHED", "FAILED", "CANCELLED"],
  DISPATCHED: ["RUNNING", "FAILED", "CANCELLED"],
  RUNNING: ["SUCCEEDED", "FAILED", "CANCELLED"],
  SUCCEEDED: [],
  FAILED: [],
  CANCELLED: []
};
