import {
  resolveCapability
} from "../capabilities/registry.js";

import {
  getProvider
} from "../providers/registry.js";


import type {
  CapabilityExecutionContext,
  CapabilityExecutionResult
} from "./types.js";


export async function executeCapability(
  context: CapabilityExecutionContext,
  input: unknown
): Promise<CapabilityExecutionResult> {


  try {

    const capability =
      resolveCapability(
        context.capability
      );


    const provider =
      getProvider(
        capability.provider
      );


    const response =
      await provider.execute({
        prompt: JSON.stringify(input)
      });


    return {

      success: true,

      capability:
        capability.name,

      provider:
        provider.name,

      output:
        response.text

    };


  } catch(error) {


    return {

      success:false,

      capability:
        context.capability,

      provider:"unknown",

      error:
        String(error)

    };

  }

}
