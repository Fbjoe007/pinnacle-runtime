import type { ExecutionState } from "./types.js";
import { allowedTransitions } from "./transitions.js";

export function canTransition(
  from: ExecutionState,
  to: ExecutionState
): boolean {
  const allowed = allowedTransitions[from];
  return allowed ? allowed.includes(to) : false;
}
