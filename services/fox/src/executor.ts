import type {
  FoxRequest,
  FoxResponse
} from "./types.js";

import {
  resolveCapability
} from "./capabilities/registry.js";

import {
  resolveProvider
} from "./providers/registry.js";


export async function executeFox(
  request: FoxRequest
): Promise<FoxResponse> {

  try {

    const capability =
      resolveCapability(
        request.capability
      );


    const provider =
      resolveProvider(
        capability.provider
      );


    const response =
      await provider.execute({
        prompt:
          String(request.input)
      });


    return {

      success: true,

      output: {

        provider:
          capability.provider,

        capability:
          request.capability,

        response:
          response.text

      }

    };


  } catch (error) {

    return {

      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Unknown error"

    };

  }

}
