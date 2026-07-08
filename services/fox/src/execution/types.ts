import type { Ledger } from "@pinnacle/runtime-sdk";

export interface FoxRequest {
  capability: string;
  payload: unknown;
}

export interface FoxResponse {
  success: boolean;
  output?: unknown;
  error?: string;
}

export interface CapabilityExecutionContext {
  ledger?: Ledger;
  tenantId?: string;
}
