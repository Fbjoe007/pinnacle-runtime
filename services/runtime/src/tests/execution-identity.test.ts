import { describe, expect, it } from "vitest";
import { executeRuntime } from "../executions/service.js";
import type { Ledger, LedgerEntry } from "@pinnacle/runtime-sdk";

// Define a minimal test mock for the runtime ledger
const mockLedger: Ledger = {
  append: (_entry: LedgerEntry) => {},
  entries: () => []
};

describe("Runtime execution identity", () => {
  it("creates a Runtime-owned execution identity", async () => {
    const result = await executeRuntime(mockLedger, {
      capability: "vertex",
      input: {
        message: "runtime identity test"
      }
    });

    expect(result.success).toBe(true);
    expect(result.execution).toBeDefined();
    expect(result.execution.executionId).toBeDefined();
    expect(result.execution.capability).toBe("vertex");
  });
});
