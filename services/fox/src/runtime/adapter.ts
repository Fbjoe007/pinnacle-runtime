import type {
  Ledger
} from "@pinnacle/runtime-sdk";

import {
  executeCapability
} from "../execution/runner.js";

import type {
  FoxRequest,
  FoxResponse
} from "../types.js";


export async function executeFoxRuntime(
  tenantId: string,
  request: FoxRequest,
  ledger: Ledger
): Promise<FoxResponse> {


  const result =
    await executeCapability(
      tenantId,

      {
        capability:
          request.capability,

        input:
          request.input
      },

      ledger
    );


  return result;

}
