import { RiskAssessment } from "../scoring/risk.types.js";

export interface SummaryInput {
  assessment: RiskAssessment;
  businessName: string;
}

export interface ExecutiveSummary {
  headline: string;
  criticalImpact: string;
  recommendedAction: string;
  generatedAt: string;
}