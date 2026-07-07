import type { Ledger, LedgerEntry } from "./types.js";

export class InMemoryLedger implements Ledger {
  private readonly history: LedgerEntry[] = [];

  append(entry: LedgerEntry): void {
    this.history.push(Object.freeze(entry));
  }

  entries(): readonly LedgerEntry[] {
    return this.history;
  }
}
