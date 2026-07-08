import type {
  FoxRequest,
  FoxResponse
} from "./types.js";


import {
  executeCapability
} from "./execution/runner.js";


export async function executeFox(
  request: FoxRequest
): Promise<FoxResponse> {


  const result =
    await executeCapability(
      {
        tenantId:"default",

        executionId:
          crypto.randomUUID(),

        capability:
          request.capability

      },

      request.input

    );


  if(!result.success){

    return {

      success:false,

      error:
        result.error

    };

  }


  return {

    success:true,

    output:{

      capability:
        result.capability,

      provider:
        result.provider,

      response:
        result.output

    }

  };

}
