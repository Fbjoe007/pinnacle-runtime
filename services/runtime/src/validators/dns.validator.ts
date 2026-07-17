import { promises as dns } from "dns";
import type { ValidatorResult, EvidenceItem } from "../core/types.js";

export async function validateDns(domain: string): Promise<ValidatorResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  const evidence: EvidenceItem[] = [];
  const warnings: string[] = [];
  let passed = true;

  try {
    // 1. Audit A Records (Domain Existence)
    try {
      const aRecords = await dns.resolve4(domain);
      evidence.push({
        code: "DNS_A_RECORD_FOUND",
        value: aRecords,
        description: `Resolved ${aRecords.length} IPv4 address(es).`
      });
    } catch (err: any) {
      passed = false;
      evidence.push({
        code: "DNS_A_RECORD_MISSING",
        value: false,
        description: `Failed to resolve IPv4 addresses: ${err.message}`
      });
    }

    // 2. Audit MX Records (Mail Infrastructure)
    if (passed) {
      try {
        const mxRecords = await dns.resolveMx(domain);
        const sortedMx = mxRecords.sort((a, b) => a.priority - b.priority);
        evidence.push({
          code: "MX_RECORD_PRESENT",
          value: sortedMx,
          description: `Configured with ${mxRecords.length} mail exchangers.`
        });
      } catch (err: any) {
        warnings.push(`Domain resolves but lacks valid MX infrastructure: ${err.message}`);
        evidence.push({
          code: "MX_RECORD_MISSING",
          value: false
        });
      }
    }

    // 3. Optional TXT Record foot-printing (SPF verification)
    if (passed) {
      try {
        const txtRecords = await dns.resolveTxt(domain);
        const flatTxt = txtRecords.flat();
        const hasSpf = flatTxt.some(record => record.includes("v=spf1"));
        evidence.push({
          code: "TXT_SPF_VERIFIED",
          value: hasSpf,
          description: hasSpf ? "SPF safety policy present" : "No SPF policy found in TXT records"
        });
      } catch {
        // TXT absence is non-fatal for domain connectivity
      }
    }
  } catch (globalErr: any) {
    passed = false;
    warnings.push(`Unhandled DNS processing fault: ${globalErr.message}`);
  }

  const duration = Date.now() - startTime;
  const score = passed ? (evidence.some(e => e.code === "MX_RECORD_PRESENT") ? 30 : 15) : 0;

  return {
    validator: "dns_validator",
    passed,
    status: passed ? "passed" : "failed",
    confidence: passed ? 0.95 : 1.0,
    score,
    maxScore: 30,
    evidence,
    warnings,
    execution_ms: duration,
    started_at: startedAt,
    finished_at: new Date().toISOString()
  };
}
