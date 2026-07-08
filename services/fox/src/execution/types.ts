export interface CapabilityExecutionContext {

  tenantId: string;

  executionId: string;

  capability: string;

}


export interface CapabilityExecutionResult {

  success: boolean;

  capability: string;

  provider: string;

  output?: unknown;

  error?: string;

}
