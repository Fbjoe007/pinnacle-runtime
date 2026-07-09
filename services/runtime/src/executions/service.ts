import {
  executeFox
} from "@pinnacle/fox";

import {
  createExecutionId
} from "../identity/execution-id.js";

import type {
  RuntimeExecution
} from "./types.js";


export interface RuntimeExecutionRequest {

  capability: string;

  input: unknown;

}


export interface RuntimeExecutionResponse {

  execution: RuntimeExecution;

  success: boolean;

  output?: unknown;

  error?: string;

}


export async function executeRuntime(
  request: RuntimeExecutionRequest
): Promise<RuntimeExecutionResponse> {


  const execution: RuntimeExecution = {

    executionId:
      createExecutionId(),

    capability:
      request.capability,

    createdAt:
      new Date()

  };


  const result =
    await executeFox({

      capability:
        request.capability,

      input:
        request.input

    });


  return {

    execution,

    success:
      result.success,

    output:
      result.output,

    error:
      result.error

  };

}
