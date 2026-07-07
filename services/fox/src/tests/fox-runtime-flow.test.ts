import { describe, expect, it } from "vitest";
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
        capability: "test-capability",
        input: {
          message: "hello runtime"
        }
      },
      ledger
    );

    expect(response.success).toBe(true);

    expect(ledger.entries().length)
      .toBe(2);

    expect(
      ledger.entries()[0].eventType
    ).toBe("FOX_EXECUTION_CREATED");

    expect(
      ledger.entries()[1].eventType
    ).toBe("FOX_EXECUTION_SUCCEEDED");

  });

});
