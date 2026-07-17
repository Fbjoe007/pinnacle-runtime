import type { ExecutionState } from "./types.js";
import { allowedTransitions } from "./transitions.js";

export interface TransitionContext {
  executionId: string;
  authorityReference: string;
  evidenceRequired: string[];
}

export function validateStateTransition(
  from: ExecutionState,
  to: ExecutionState,
  context: TransitionContext
): void {
  if (!context.authorityReference || context.authorityReference.trim() === "") {
    throw new Error(`Lifecycle Guard Violation: Authority reference missing in context for execution ${context.executionId}`);
  }

  const allowed = allowedTransitions[from];
  if (!allowed || !allowed.includes(to)) {
    throw new Error(`Lifecycle Guard Violation: Illegal state transition from \x27${from}\x27 to \x27${to}\x27.`);
  }
}
