import { describe, expect, it } from "vitest";

import {
  executeFoxRuntime
} from "../index.js";

import {
  InMemoryLedger
} from "@pinnacle/runtime-sdk";


describe("Fox Runtime execution", () => {

  it("records Fox execution through Runtime ledger", async () => {

    const ledger =
      new InMemoryLedger();


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


    const events =
      ledger.entries()
        .map(
          entry => entry.eventType
        );


    console.log(events);


    expect(response.success)
      .toBe(true);


    expect(events)
      .toContain(
        "FOX_EXECUTION_CREATED"
      );


    expect(events)
      .toContain(
        "CAPABILITY_AUTHORIZATION_CHECKED"
      );


    expect(events)
      .toContain(
        "CAPABILITY_RESULT_VALIDATED"
      );


    expect(events)
      .toContain(
        "FOX_EXECUTION_SUCCEEDED"
      );

  });

});
