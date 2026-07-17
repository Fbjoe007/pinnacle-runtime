-- =============================================================================
-- UPVIEW.BUZZ PRODUCTION INIT SCHEMA MIGRATION V1
-- =============================================================================

BEGIN;

-- Enable core baseline security extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. EXTENSION & AUTOMATION UTILITIES
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. TABLE PROVISIONING
-- -----------------------------------------------------------------------------

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CONSTRAINT chk_user_role CHECK (role IN ('admin', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    status TEXT NOT NULL CONSTRAINT chk_execution_status CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_executions_updated_at
BEFORE UPDATE ON executions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE validation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL,
    status TEXT NOT NULL CONSTRAINT chk_job_status CHECK (status IN ('pending', 'running', 'success', 'failed')),
    error_log TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE evidence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    validation_job_id UUID NOT NULL REFERENCES validation_jobs(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    validation_job_id UUID NOT NULL UNIQUE REFERENCES validation_jobs(id) ON DELETE CASCADE,
    risk_score NUMERIC(5,2) NOT NULL CONSTRAINT chk_risk_score CHECK (risk_score >= 0.00 AND risk_score <= 100.00),
    risk_level TEXT NOT NULL CONSTRAINT chk_risk_level CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_assessment_id UUID NOT NULL UNIQUE REFERENCES risk_assessments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    execution_id UUID REFERENCES executions(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    format TEXT NOT NULL CONSTRAINT chk_report_format CHECK (format IN ('pdf', 'csv', 'txt')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    ip_address INET,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 3. HIGH-THROUGHPUT INDEX OPTIMIZATIONS
-- -----------------------------------------------------------------------------
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_executions_organization_status ON executions(organization_id, status);
CREATE INDEX idx_executions_created_at ON executions(created_at DESC);
CREATE INDEX idx_validation_jobs_execution_status ON validation_jobs(execution_id, status);
CREATE INDEX idx_evidence_items_job ON evidence_items(validation_job_id);
CREATE INDEX idx_risk_assessments_job_level ON risk_assessments(validation_job_id, risk_level);
CREATE INDEX idx_reports_organization ON reports(organization_id);
CREATE INDEX idx_audit_events_org_action ON audit_events(organization_id, action);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at DESC);

-- -----------------------------------------------------------------------------
-- 4. STORAGE BUCKET CONFIGURATION
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES 
('reports', 'reports', false),
('imports', 'imports', false),
('branding', 'branding', true),
('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

COMMIT;
