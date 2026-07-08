import { describe, expect, it } from "vitest";
import { executeFox } from "../index.js";

describe("Vertex capability", () => {

  it("executes a Vertex capability request", async () => {

    const response = await executeFox({
      capability: "vertex",
      input: "Explain Runtime architecture"
    });

    expect(response.success).toBe(true);

    expect(response.output).toEqual({
      provider: "vertex",
      capability: "vertex",
      response:
        'Vertex placeholder response for: "Explain Runtime architecture"'
    });

  });

});
