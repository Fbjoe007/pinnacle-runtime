import { DNSValidator } from "./validators/dns/dns.validator.js";
import { HTTPSValidator } from "./validators/https/https.validator.js";
import { GoogleBusinessValidator } from "./validators/google-business/google-business.validator.js";
import { RiskScoringEngine } from "./scoring/risk-engine.js";
import { SummaryEngine } from "./summary/summary.engine.js";
import { EvidenceItem } from "@pinnacle/validator-sdk";

export interface PipelineResult {
  validationId: string;
  businessName: string;
  evidence: EvidenceItem[];
  assessment: any;
  summary: any;
}

export class ValidationPipeline {
  private scoring = new RiskScoringEngine();
  private summary = new SummaryEngine();

  public async runFullAssessment(businessName: string, domain: string): Promise<PipelineResult> {
    const evidence: EvidenceItem[] = [];
    const dns = new DNSValidator();
    const https = new HTTPSValidator();
    const google = new GoogleBusinessValidator();

    const chunks = await Promise.all([
      dns.execute({ domain }),
      https.execute({ url: domain }),
      google.execute({ businessName, website: domain })
    ]);

    evidence.push(...chunks.flat());
    const assessment = this.scoring.calculateRisk(evidence);
    const summary = this.summary.generateSummary({ assessment, businessName });

    return {
      validationId: "val_" + Math.random().toString(36).substring(2, 15),
      businessName,
      evidence,
      assessment,
      summary
    };
  }
}