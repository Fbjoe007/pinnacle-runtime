import type { FoxRequest, FoxResponse } from "./types.js";

export async function executeFox(
  request: FoxRequest
): Promise<FoxResponse> {

  try {

    const result = {
      capability: request.capability,
      processed: true,
      input: request.input
    };

    return {
      success: true,
      output: result
    };

  } catch (error) {

    return {
      success: false,
      error: String(error)
    };

  }
}
