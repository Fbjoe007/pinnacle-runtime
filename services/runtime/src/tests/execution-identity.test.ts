import {
  describe,
  expect,
  it
} from "vitest";

import {
  executeRuntime
} from "../executions/service.js";


describe("Runtime execution identity", () => {

  it("creates a Runtime-owned execution identity", async () => {

    const result =
      await executeRuntime({

        capability: "vertex",

        input: {
          message: "runtime identity test"
        }

      });


    expect(result.success)
      .toBe(true);


    expect(result.execution)
      .toBeDefined();


    expect(result.execution.executionId)
      .toBeDefined();


    expect(result.execution.capability)
      .toBe("vertex");

  });

});
