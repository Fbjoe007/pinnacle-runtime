export interface FoxRequest {
  capability: string;
  input: unknown;
}

export interface FoxResponse {
  success: boolean;
  output?: unknown;
  error?: string;
}
