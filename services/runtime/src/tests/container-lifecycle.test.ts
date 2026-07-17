import { describe, test, expect } from "vitest";
import { createRuntimeContainer } from "../bootstrap/runtime-container.js";

describe("Runtime Container: Lifecycle Composition Governance", () => {
  test("Should fail boot immediately if explicit configurations are missing", () => {
    expect(() => {
      createRuntimeContainer({ databaseUrl: "" });
    }).toThrow("Bootstrap Failure: databaseUrl configuration value is required.");
  });

  test("Should cleanly encapsulate components and close out resources upon shutdown sequence", async () => {
    const fakeUrl = "postgres://postgres:postgres@localhost:5433/pinnacle_test";
    const container = createRuntimeContainer({ databaseUrl: fakeUrl, maxConnections: 1 });

    expect(container.ledger).toBeDefined();
    await expect(container.shutdown()).resolves.not.toThrow();
  });
});
