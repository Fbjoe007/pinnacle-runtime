export interface ValidatorResult {
  validator: string;
  passed: boolean;
  status: "passed" | "failed";
  score: number;
  maxScore: number;
  evidence: any[];
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
