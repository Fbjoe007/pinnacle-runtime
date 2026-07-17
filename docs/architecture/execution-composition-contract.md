# Execution Composition Contract

## 1. Core Philosophy
Pinnacle execution complexity must emerge from strict, deterministic primitives. Graphs do not possess intrinsic execution authority; they are structures of evidence consumed by the Runtime Engine.

## 2. Structural Composition Primitives
Execution composition is broken down into two distinct contract layers:

### ExecutionPlan
- `executionId: string` - The unique cryptographic reference anchoring the lifecycle.
- `steps: ExecutionStep[]` - An array of isolated capability units.

### ExecutionStep
- `stepId: string` - Unique identifier within this plan context.
- `capability: string` - The logical action string requested.
- `dependencies: string[]` - Upstream step IDs that must reach terminal success before this step can enter an active state.

## 3. Evidence-Aware Transition Context
Every state transition demands a strict reason boundary to ensure that future structural replays can audit why an execution advanced.

```typescript
interface TransitionContext {
  executionId: string;
  authorityReference: string;
  evidenceRequired: string[];
}
```
