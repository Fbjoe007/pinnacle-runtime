import type { Ledger, LedgerEntry } from "@pinnacle/runtime-sdk";

export interface DatabaseClient {
  query<T>(sql: string, values?: unknown[]): Promise<{ rows: T[] }>;
}

export class PostgresLedger implements Ledger {
  private readonly appendedEntries: LedgerEntry[] = [];

  constructor(private readonly client: DatabaseClient) {}

  async append(entry: LedgerEntry): Promise<void> {
    await this.client.query("BEGIN");

    try {
      const payloadObj = (entry.payload && typeof entry.payload === "object") ? (entry.payload as Record<string, unknown>) : {};
      
      const authorityType = String(payloadObj.authorityType || payloadObj.authority_type || "SYSTEM");
      const authorityId = String(payloadObj.authorityId || payloadObj.authority_id || "pinnacle-core");

      await this.client.query(
        `
        INSERT INTO ledger_events
        (id, execution_id, event_type, authority_type, authority_id, evidence_payload, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          entry.id,
          entry.executionId,
          entry.eventType,
          authorityType,
          authorityId,
          JSON.stringify(entry.payload),
          entry.timestamp
        ]
      );

      this.appendedEntries.push(entry);
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }

  }
  entries(): readonly LedgerEntry[] {
    return this.appendedEntries;
  }
}
