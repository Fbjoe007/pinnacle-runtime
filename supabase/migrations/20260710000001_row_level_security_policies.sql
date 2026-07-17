-- =============================================================================
-- UPVIEW.BUZZ MULTI-TENANT ROW LEVEL SECURITY POLICIES
-- =============================================================================

BEGIN;

-- Enable RLS across the public schema
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- HELPER FUNCTION: Resolve Session Tenant ID Context
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->'user_metadata'->>'organization_id', '')::uuid;
$$ LANGUAGE sql STABLE;

-- -----------------------------------------------------------------------------
-- RLS POLICIES FOR TENANT DATA TABLES
-- -----------------------------------------------------------------------------

CREATE POLICY org_isolation ON organizations 
    FOR ALL USING (id = current_tenant_id());

CREATE POLICY user_isolation ON users 
    FOR ALL USING (organization_id = current_tenant_id());

CREATE POLICY execution_isolation ON executions 
    FOR ALL USING (organization_id = current_tenant_id());

CREATE POLICY job_isolation ON validation_jobs 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM executions 
            WHERE executions.id = validation_jobs.execution_id 
            AND executions.organization_id = current_tenant_id()
        )
    );

CREATE POLICY evidence_isolation ON evidence_items 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM validation_jobs
            JOIN executions ON executions.id = validation_jobs.execution_id
            WHERE validation_jobs.id = evidence_items.validation_job_id 
            AND executions.organization_id = current_tenant_id()
        )
    );

CREATE POLICY risk_isolation ON risk_assessments 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM validation_jobs
            JOIN executions ON executions.id = validation_jobs.execution_id
            WHERE validation_jobs.id = risk_assessments.validation_job_id 
            AND executions.organization_id = current_tenant_id()
        )
    );

CREATE POLICY summary_isolation ON summaries 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM risk_assessments
            JOIN validation_jobs ON validation_jobs.id = risk_assessments.validation_job_id
            JOIN executions ON executions.id = validation_jobs.execution_id
            WHERE risk_assessments.id = summaries.risk_assessment_id 
            AND executions.organization_id = current_tenant_id()
        )
    );

CREATE POLICY report_isolation ON reports 
    FOR ALL USING (organization_id = current_tenant_id());

CREATE POLICY audit_isolation ON audit_events 
    FOR SELECT USING (organization_id = current_tenant_id());

CREATE POLICY audit_append ON audit_events 
    FOR INSERT WITH CHECK (organization_id = current_tenant_id());

-- -----------------------------------------------------------------------------
-- STORAGE BUCKET ACCESSIBILITY LAYER POLICIES
-- -----------------------------------------------------------------------------
CREATE POLICY "Tenants can access their own report objects" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id = 'reports' AND (storage.foldername(name))[1] = current_tenant_id()::text);

CREATE POLICY "Tenants can manage their own imports" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id = 'imports' AND (storage.foldername(name))[1] = current_tenant_id()::text);

COMMIT;
