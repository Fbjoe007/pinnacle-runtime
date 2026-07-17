-- =============================================================================
-- UPVIEW.BUZZ SEED DATA DATASET V1 (DEVELOPMENT/STAGING USE ONLY)
-- =============================================================================

BEGIN;

INSERT INTO organizations (id, name, slug) VALUES
('aa000000-0000-0000-0000-0000000000aa', 'Pinnacle Systems Ltd', 'pinnacle-systems'),
('bb000000-0000-0000-0000-0000000000bb', 'Apex Ingestion Corp', 'apex-corp')
ON CONFLICT (id) DO NOTHING;

INSERT INTO executions (id, organization_id, status, meta) VALUES
('e1111111-1111-1111-1111-111111111111', 'aa000000-0000-0000-0000-0000000000aa', 'completed', '{"source": "lead_upload_v1.csv", "total_records": 1}'),
('e2222222-2222-2222-2222-222222222222', 'aa000000-0000-0000-0000-0000000000aa', 'processing', '{"source": "realtime_api_stream", "total_records": 105}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO validation_jobs (id, execution_id, input_data, status) VALUES
('a1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '{"target_domain": "suspicious-entity.biz", "registrar": "unknown"}', 'success')
ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_items (validation_job_id, key, value) VALUES
('a1111111-1111-1111-1111-111111111111', 'dns_sec_valid', '{"status": false, "reason": "Missing signatures"}'),
('a1111111-1111-1111-1111-111111111111', 'ssl_expiration', '{"days_remaining": 3, "issuer": "Let''s Encrypt"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO risk_assessments (id, validation_job_id, risk_score, risk_level) VALUES
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 88.50, 'high')
ON CONFLICT (id) DO NOTHING;

INSERT INTO summaries (risk_assessment_id, content) VALUES
('b1111111-1111-1111-1111-111111111111', 'Domain security health is compromised. SSL certificate expires in less than 72 hours and DNSSec lacks signing structures. High probability of impersonation vulnerabilities.')
ON CONFLICT (id) DO NOTHING;

COMMIT;
