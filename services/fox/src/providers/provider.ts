export interface AIRequest {
  prompt: string;
}

export interface AIResponse {
  text: string;
}

export interface AIProvider {
  readonly name: string;

  execute(
    request: AIRequest
  ): Promise<AIResponse>;
}
