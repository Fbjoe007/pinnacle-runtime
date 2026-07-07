import type { LedgerEntry } from "../ledger/types.js";

export interface ReplayResult {
  executionId: string;
  events: number;
}

export function replay(
  entries: readonly LedgerEntry[]
): ReplayResult {
  if (entries.length === 0) {
    throw new Error("Cannot replay empty ledger");
  }

  return {
    executionId: entries[0].executionId,
    events: entries.length
  };
}
