import { describe, expect, it } from "vitest";
import { executeFox } from "../index.js";

describe("Fox execution", () => {

  it("executes a capability request", async () => {

    const response = await executeFox({
      capability: "test-capability",
      input: {
        message: "hello fox"
      }
    });

    expect(response.success).toBe(true);
    expect(response.output).toBeDefined();

  });

});
