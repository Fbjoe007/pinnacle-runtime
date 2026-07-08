import {
  describe,
  expect,
  it
} from "vitest";

import {
  executeFoxRuntime
} from "../index.js";

import {
  InMemoryLedger
} from "@pinnacle/runtime-sdk";

describe("Fox Runtime execution", () => {

  it("records Fox execution through Runtime ledger", async () => {

    const ledger = new InMemoryLedger();

    const response = await executeFoxRuntime(
      "tenant-test",
      {
        capability: "vertex",
        input: {
          message: "hello runtime"
        }
      },
      ledger
    );

    expect(response.success).toBe(true);

    const entries = ledger.entries();

    expect(entries.length)
      .toBeGreaterThanOrEqual(2);

    expect(
      entries.some(
        entry =>
          entry.eventType === "FOX_EXECUTION_CREATED"
      )
    ).toBe(true);

    expect(
      entries.some(
        entry =>
          entry.eventType === "FOX_EXECUTION_SUCCEEDED"
      )
    ).toBe(true);

    const executionIds = new Set(
      entries.map(
        entry => entry.executionId
      )
    );

    expect(executionIds.size)
      .toBe(1);

  });

});
