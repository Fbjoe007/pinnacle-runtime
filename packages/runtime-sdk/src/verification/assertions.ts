import { canTransition } from "../execution/lifecycle.js";
import type { ExecutionState } from "../execution/types.js";

export function assertValidTransition(
  from: ExecutionState,
  to: ExecutionState
): void {
  if (!canTransition(from, to)) {
    throw new Error(
      `Invalid execution transition: ${from} -> ${to}`
    );
  }
}
