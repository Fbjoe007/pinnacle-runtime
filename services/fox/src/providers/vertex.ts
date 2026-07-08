import type {
  AIProvider,
  AIRequest,
  AIResponse
} from "./provider.js";

export const vertexProvider: AIProvider = {

  name: "vertex",

  async execute(
    request: AIRequest
  ): Promise<AIResponse> {

    return {
      text: `Vertex placeholder response for: ${request.prompt}`
    };

  }

};
