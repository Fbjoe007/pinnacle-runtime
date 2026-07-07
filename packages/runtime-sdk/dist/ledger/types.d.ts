export type LedgerEntryId = string;
export interface LedgerEntry {
    id: LedgerEntryId;
    executionId: string;
    eventType: string;
    timestamp: Date;
    payload: unknown;
}
export interface Ledger {
    append(entry: LedgerEntry): void;
    entries(): readonly LedgerEntry[];
}
