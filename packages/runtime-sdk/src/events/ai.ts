export type AIEventType =
  | "AI_PROVIDER_SELECTED"
  | "AI_REQUEST_STARTED"
  | "AI_RESPONSE_RECEIVED";

export interface AIEvent {
  type: AIEventType;
  executionId: string;
  provider: string;
  timestamp: Date;
  payload: unknown;
}
