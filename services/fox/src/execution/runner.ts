import {
  createExecution
} from "@pinnacle/runtime-sdk";

import type {
  Ledger
} from "@pinnacle/runtime-sdk";

import {
  authorizeCapability
} from "../policy/authorize.js";

import {
  executeFox
} from "../executor.js";

import {
  validateCapabilityResult
} from "../validation/validator.js";


export interface CapabilityRequest {

  capability: string;

  input: unknown;

}


export interface CapabilityResponse {

  success: boolean;

  output?: unknown;

  error?: string;

}


export async function executeCapability(
  tenantId: string,
  request: CapabilityRequest,
  ledger: Ledger
): Promise<CapabilityResponse> {


  const execution =
    createExecution(tenantId);


  ledger.append({

    id: crypto.randomUUID(),

    executionId:
      execution.executionId,

    eventType:
      "FOX_EXECUTION_CREATED",

    timestamp:
      new Date(),

    payload: {

      capability:
        request.capability

    }

  });


  authorizeCapability(
    tenantId,
    request.capability
  );


  ledger.append({

    id: crypto.randomUUID(),

    executionId:
      execution.executionId,

    eventType:
      "CAPABILITY_AUTHORIZATION_CHECKED",

    timestamp:
      new Date(),

    payload: {

      tenantId,

      capability:
        request.capability

    }

  });


  const result =
    await executeFox({

      capability:
        request.capability,

      input:
        request.input

    });


  if (result.success) {


    const validation =
      validateCapabilityResult(
        result.output
      );


    ledger.append({

      id:
        crypto.randomUUID(),

      executionId:
        execution.executionId,

      eventType:
        validation.valid
          ? "CAPABILITY_RESULT_VALIDATED"
          : "CAPABILITY_RESULT_INVALID",

      timestamp:
        new Date(),

      payload:
        validation

    });


    if (!validation.valid) {

      return {

        success: false,

        error:
          validation.reason

      };

    }

  }


  ledger.append({

    id:
      crypto.randomUUID(),

    executionId:
      execution.executionId,

    eventType:
      result.success
        ? "FOX_EXECUTION_SUCCEEDED"
        : "FOX_EXECUTION_FAILED",

    timestamp:
      new Date(),

    payload:
      result

  });


  return result;

}
