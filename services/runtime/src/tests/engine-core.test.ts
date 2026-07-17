import { describe, test, expect } from "vitest";
import { RuntimeExecutionEngine, type CapabilityRequest, type CapabilityResult } from "../executions/engine.js";
import type { Ledger, LedgerEntry } from "@pinnacle/runtime-sdk";

class MockLedger implements Ledger {
  public readonly recordedEntries: LedgerEntry[] = [];
  append(entry: LedgerEntry): void {
    this.recordedEntries.push(entry);
  }
  entries(): readonly LedgerEntry[] {
    return this.recordedEntries;
  }
}

describe("Runtime Execution Engine: Core Isolation & Invariants", () => {
  test("Should execute a successful capability path and commit structured ledger evidence", async () => {
    const ledger = new MockLedger();
    const engine = new RuntimeExecutionEngine({
      ledger,
      invokeCapability: async (req: CapabilityRequest): Promise<CapabilityResult> => {
        return { success: true, output: { calculatedValue: 42 } };
      }
    });

    const execution = await engine.execute("tenant-omega", {
      capability: "compute_hash",
      input: { raw: "pinnacle-data" }
    });

    expect(execution.executionId).toBeDefined();
    expect(execution.state).toBe("SUCCEEDED");

    const history = ledger.entries();
    expect(history.length).toBe(3); // CREATED -> RUNNING -> SUCCEEDED
    expect(history[0].eventType).toBe("EXECUTION_CREATED");
    expect(history[1].eventType).toBe("EXECUTION_RUNNING");
    expect(history[2].eventType).toBe("EXECUTION_SUCCEEDED");
    expect((history[2].payload as any).output.calculatedValue).toBe(42);
  });

  test("Should catch capability failures cleanly and mark the terminal state as FAILED with evidence", async () => {
    const ledger = new MockLedger();
    const engine = new RuntimeExecutionEngine({
      ledger,
      invokeCapability: async (req: CapabilityRequest): Promise<CapabilityResult> => {
        return { success: false, error: "Provider Connection Lost" };
      }
    });

    const execution = await engine.execute("tenant-omega", {
      capability: "fetch_secure_keys",
      input: {}
    });

    expect(execution.state).toBe("FAILED");
    const history = ledger.entries();
    expect(history[history.length - 1].eventType).toBe("EXECUTION_FAILED");
    expect((history[history.length - 1].payload as any).error).toBe("Provider Connection Lost");
  });
});
