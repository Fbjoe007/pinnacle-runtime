export type CapabilityEventType =
  | "CAPABILITY_REQUESTED"
  | "CAPABILITY_STARTED"
  | "CAPABILITY_COMPLETED"
  | "CAPABILITY_FAILED";


export interface CapabilityEvent {

  id: string;

  executionId: string;

  eventType: CapabilityEventType;

  timestamp: Date;

  payload: unknown;

}
