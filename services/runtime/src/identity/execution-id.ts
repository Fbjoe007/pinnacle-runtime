import { randomUUID } from "crypto";

export function createExecutionId(): string {
  return randomUUID();
}
