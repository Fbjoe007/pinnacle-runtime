export interface RuntimeEvent {
  eventId: string;
  executionId: string;
  type: string;
  timestamp: Date;
  payload: unknown;
}
