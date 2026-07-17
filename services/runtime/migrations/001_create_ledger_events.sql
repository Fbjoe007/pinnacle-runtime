CREATE TABLE IF NOT EXISTS ledger_events (
    id VARCHAR(255) PRIMARY KEY,
    execution_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    authority_type VARCHAR(50) NOT NULL,
    authority_id VARCHAR(255) NOT NULL,
    evidence_payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION prevent_ledger_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Pinnacle Runtime Contract Violation: Ledger events are immutable';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_ledger_immutability ON ledger_events;
CREATE TRIGGER enforce_ledger_immutability
BEFORE UPDATE OR DELETE ON ledger_events
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_mutation();
