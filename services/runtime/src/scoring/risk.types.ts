export interface RiskFinding {
  severity: "INFO" | "WARN" | "FAIL";
  reason: string;
}

export interface RiskAssessment {
  score: number;
  rating: "HEALTHY" | "CAUTION" | "HIGH_RISK";
  confidence: number;
  findings: RiskFinding[];
  generatedAt: string;
}