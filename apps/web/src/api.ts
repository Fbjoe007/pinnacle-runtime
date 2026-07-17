import { Execution } from "@pinnacle/runtime-sdk";

const API_BASE = import.meta.env.VITE_RUNTIME_URL || "https://upview.buzz";

export interface ExecutionResponse {
  execution: Execution;
  success: boolean;
  output?: any;
  ledger?: {
    merkleRoot: string;
    signature: string;
  };
  error?: string;
}

export async function createExecution(data: any): Promise<ExecutionResponse> {
  const response = await fetch(`${API_BASE}/api/v1/executions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("pinnacle_jwt") || ""}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function getExecutionById(executionId: string): Promise<ExecutionResponse> {
  const response = await fetch(`${API_BASE}/api/v1/executions/${executionId}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("pinnacle_jwt") || ""}`,
      "Content-Type": "application/json"
    }
  });
  return response.json();
}
