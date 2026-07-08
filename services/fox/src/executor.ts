import type {
  FoxRequest,
  FoxResponse
} from "./types.js";

import {
  resolveCapability
} from "./capabilities/registry.js";

import {
  getProvider
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
      getProvider(
        capability.provider
      );

    const response =
      await provider.execute({
        prompt: JSON.stringify(
          request.input
        )
      });

    return {
      success: true,
      output: {
        provider: provider.name,
        capability: capability.name,
        response: response.text
      }
    };

  } catch (error) {

    return {
      success: false,
      error: String(error)
    };

  }

}
