export interface EvidenceItem {
  code: string;
  value: any;
  description?: string;
}

export interface ValidatorResult {
  validator: string;
  passed: boolean;
  status: "passed" | "failed";
  confidence: number;
  score: number;
  maxScore: number;
  evidence: EvidenceItem[];
  warnings: string[];
  execution_ms: number;
  started_at: string;
  finished_at: string;
}

export interface InboundJob {
  id: string;
  domain: string;
  businessName: string;
  locationHint?: string;
  status: "pending" | "processing" | "completed" | "failed";
}

export interface LeadValidationResult {
  jobId: string;
  domain: string;
  passed: boolean;
  totalScore: number;
  maxScore: number;
  breakdown: Record<string, ValidatorResult>;
  processedAt: string;
}
