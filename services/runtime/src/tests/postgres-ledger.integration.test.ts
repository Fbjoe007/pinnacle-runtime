import { describe, test, beforeAll, afterAll, expect } from 'vitest';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

describe('Postgres Ledger: Physical Constitutional Guardrails', () => {
  let client: Client;
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/pinnacle_test';

  beforeAll(async () => {
    client = new Client({ connectionString });
    await client.connect();
    
    await client.query('DROP TABLE IF EXISTS ledger_events CASCADE;');
    
    // Corrected path: __dirname is services/runtime/src/tests
    // ../../ resolves to services/runtime/
    const migrationSql = fs.readFileSync(
      path.join(__dirname, '../../migrations/001_create_ledger_events.sql'),
      'utf8'
    );
    await client.query(migrationSql);
  });

  afterAll(async () => {
    await client.end();
  });

  test('Constitutional Guardrail: SQL-level UPDATE and DELETE must be physically aborted by the trigger', async () => {
    await client.query('TRUNCATE TABLE ledger_events;');

    const insertResult = await client.query(`
      INSERT INTO ledger_events (execution_id, event_type, authority_type, authority_id, evidence_payload)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `, ['exec_001', 'system_boot', 'SYSTEM', 'kernel', JSON.stringify({ valid: true })]);
    
    const entryId = insertResult.rows[0].id;

    await expect(
      client.query('UPDATE ledger_events SET event_type = $1 WHERE id = $2;', ['corrupted_type', entryId])
    ).rejects.toThrow('Pinnacle Runtime Contract Violation: Ledger events are immutable');

    await expect(
      client.query('DELETE FROM ledger_events WHERE id = $1;', [entryId])
    ).rejects.toThrow('Pinnacle Runtime Contract Violation: Ledger events are immutable');
  });
});
