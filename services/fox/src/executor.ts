import type {
  FoxRequest,
  FoxResponse
} from "./types.js";

import { getProvider } from "./providers/registry.js";

export async function executeFox(
  request: FoxRequest
): Promise<FoxResponse> {

  try {

    const provider = getProvider();

    const response = await provider.execute({
      prompt: JSON.stringify(request.input)
    });

    return {
      success: true,
      output: {
        provider: provider.name,
        capability: request.capability,
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
