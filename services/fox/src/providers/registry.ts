import type {
  AIProvider
} from "./provider.js";

import {
  vertexProvider
} from "./vertex.js";


export function resolveProvider(
  name = "vertex"
): AIProvider {

  switch (name) {

    case "vertex":
      return vertexProvider;

    default:
      throw new Error(
        `Unknown AI provider: ${name}`
      );

  }

}
