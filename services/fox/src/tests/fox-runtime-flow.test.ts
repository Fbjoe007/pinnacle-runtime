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

    const response =
      await executeFoxRuntime(
        "tenant-test",
        {
          capability: "vertex",

          input: {
            message: "hello runtime"
          }
        },
        ledger
      );


    console.log(
      ledger.entries().map(
        entry => entry.eventType
      )
    );


    expect(response.success)
      .toBe(true);

  });

});
