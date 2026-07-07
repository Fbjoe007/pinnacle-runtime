import type { Ledger, LedgerEntry } from "./types.js";
export declare class InMemoryLedger implements Ledger {
    private readonly history;
    append(entry: LedgerEntry): void;
    entries(): readonly LedgerEntry[];
}
