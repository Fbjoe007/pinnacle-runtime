import {
  executeFox
} from "@pinnacle/fox";

export interface RuntimeExecutionRequest {
  capability: string;
  input: unknown;
}

export interface RuntimeExecutionResponse {
  success: boolean;
  output?: unknown;
  error?: string;
}

export async function executeRuntime(
  request: RuntimeExecutionRequest
): Promise<RuntimeExecutionResponse> {

  return executeFox({
    capability: request.capability,
    input: request.input
  });

}
