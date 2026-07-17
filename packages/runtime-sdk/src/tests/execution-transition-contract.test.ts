import { describe, it, expect } from "vitest";
import { validateStateTransition } from "../execution/state.js";

describe("Execution Transition Contract (Phase 4)", () => {
  const validContext = {
    executionId: "exec-123",
    authorityReference: "auth-sig-xyz",
    evidenceRequired: ["ledger_payload"]
  };

  it("should allow valid phase transitions", () => {
    expect(() => validateStateTransition("CREATED", "RUNNING", validContext)).not.toThrow();
    expect(() => validateStateTransition("REQUESTED", "AUTHORIZED", validContext)).not.toThrow();
    expect(() => validateStateTransition("AUTHORIZED", "DISPATCHED", validContext)).not.toThrow();
    expect(() => validateStateTransition("DISPATCHED", "RUNNING", validContext)).not.toThrow();
  });

  it("should throw error on invalid/out-of-order transitions", () => {
    expect(() => validateStateTransition("CREATED", "SUCCEEDED", validContext)).toThrow();
    expect(() => validateStateTransition("REQUESTED", "RUNNING", validContext)).toThrow();
  });

  it("should enforce validation context payload presence", () => {
    expect(() => validateStateTransition("REQUESTED", "AUTHORIZED", undefined as any)).toThrow();
  });
});
