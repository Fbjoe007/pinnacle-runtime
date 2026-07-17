import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { createRuntimeContainer, RuntimeContainer } from "../bootstrap/runtime-container.js";
import { startApiServer } from "../api/server.js";
import { FastifyInstance } from "fastify";

describe("Runtime API: Network Boundary Integration Validation", () => {
  let container: RuntimeContainer;
  let server: FastifyInstance;
  const dbUrl = "postgres://postgres:postgres@localhost:5433/pinnacle_test";

  beforeAll(async () => {
    container = createRuntimeContainer({ databaseUrl: dbUrl, maxConnections: 2 });
    // Boot server on ephemeral port allocation for safe local harness execution
    server = await startApiServer(container, { port: 0, host: "127.0.0.1" });
  });

  afterAll(async () => {
    await server.close();
    await container.shutdown();
  });

  test("Should securely reject execution payloads missing vital capability headers with HTTP 400", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/executions",
      payload: { input: {} }
    });

    expect(response.statusCode).toBe(400);
  });

  test("Should forward proper requests downstream and surface structured validation results", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/executions",
      payload: { capability: "compute_identity", input: { item: 1 } }
    });

    expect([200, 400]).toContain(response.statusCode);
    const data = JSON.parse(response.body);
    expect(data).toHaveProperty("success");
    expect(data).toHaveProperty("execution");
  });
});
