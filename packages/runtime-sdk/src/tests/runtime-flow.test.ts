import { describe, expect, it } from "vitest";

import {
  InMemoryLedger,
  assertValidTransition,
  replay
} from "../index.js";

describe("Runtime execution flow", () => {
  it("should create, record, and verify an execution history", () => {
    const ledger = new InMemoryLedger();

    assertValidTransition("CREATED", "RUNNING");

    ledger.append({
      id: "event-001",
      executionId: "exec-001",
      eventType: "EXECUTION_STARTED",
      timestamp: new Date(),
      payload: {
        state: "RUNNING"
      }
    });

    assertValidTransition("RUNNING", "SUCCEEDED");

    ledger.append({
      id: "event-002",
      executionId: "exec-001",
      eventType: "EXECUTION_COMPLETED",
      timestamp: new Date(),
      payload: {
        state: "SUCCEEDED"
      }
    });

    const result = replay(ledger.entries());

    expect(result.executionId).toBe("exec-001");
    expect(result.events).toBe(2);
  });
});
