import { Pool } from "pg";
import { Ledger } from "@pinnacle/runtime-sdk";
import { PostgresLedger } from "../persistence/postgres/postgres-ledger.js";
import { executeRuntime, RuntimeExecutionRequest, RuntimeExecutionResponse } from "../executions/service.js";

export interface ContainerConfig {
  readonly databaseUrl: string;
  readonly maxConnections?: number;
}

export interface RuntimeContainer {
  readonly ledger: Ledger;
  execute(request: RuntimeExecutionRequest): Promise<RuntimeExecutionResponse>;
  shutdown(): Promise<void>;
}

export function createRuntimeContainer(config: ContainerConfig): RuntimeContainer {
  if (!config.databaseUrl) {
    throw new Error("Bootstrap Failure: databaseUrl configuration value is required.");
  }

  const pool = new Pool({
    connectionString: config.databaseUrl,
    max: config.maxConnections || 10
  });

  const postgresLedger = new PostgresLedger(pool);

  return {
    ledger: postgresLedger,
    execute: (request: RuntimeExecutionRequest) => executeRuntime(postgresLedger, request),
    async shutdown(): Promise<void> {
      await pool.end();
    }
  };
}
