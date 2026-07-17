import * as dns from "dns/promises";
import { ValidatorPlugin, EvidenceItem } from "@pinnacle/validator-sdk";
import { VALIDATOR_ID, VALIDATOR_VERSION, VALIDATOR_CATEGORY, VALIDATOR_SOURCE } from "./dns.constants.js";
import { DNSValidatorInput } from "./dns.types.js";

export class DNSValidator implements ValidatorPlugin {
  public id = VALIDATOR_ID;
  public version = VALIDATOR_VERSION;
  public category = VALIDATOR_CATEGORY;

  public async execute(input: unknown): Promise<EvidenceItem[]> {
    const target = input as DNSValidatorInput;
    if (!target || typeof target.domain !== "string") {
      return [this.createEvidence("domain_resolution", false, "FAIL", "Invalid or missing domain input string")];
    }
    const domain = target.domain.trim().toLowerCase();
    const evidence: EvidenceItem[] = [];
    try {
      await dns.resolve4(domain);
      evidence.push(this.createEvidence("domain_resolution", true, "PASS", "Domain resolved successfully"));
    } catch (err: any) {
      if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
        return [
          this.createEvidence("domain_resolution", false, "FAIL", "Domain does not exist"),
          this.createEvidence("domain_has_ipv4_record", false, "FAIL", "No IPv4 mapping available"),
          this.createEvidence("domain_has_mail_exchange", false, "WARN", "No MX mapping available")
        ];
      }
      return [this.createEvidence("domain_resolution", false, "FAIL", "DNS error: " + err.message)];
    }
    try {
      const records = await dns.resolve6(domain);
      evidence.push(this.createEvidence("domain_has_ipv6_record", records.length > 0, "PASS", "IPv6 found"));
    } catch {
      evidence.push(this.createEvidence("domain_has_ipv6_record", false, "WARN", "No IPv6 found"));
    }
    try {
      const records = await dns.resolveMx(domain);
      evidence.push(this.createEvidence("domain_has_mail_exchange", records.length > 0, "PASS", "MX found"));
    } catch {
      evidence.push(this.createEvidence("domain_has_mail_exchange", false, "WARN", "No MX found"));
    }
    try {
      const txt = await dns.resolveTxt(domain);
      const flat = txt.flat().map(t => t.toLowerCase());
      const spf = flat.some(r => r.startsWith("v=spf1"));
      evidence.push(this.createEvidence("spf_record_present", spf, spf ? "PASS" : "WARN", "SPF assessment"));
    } catch {
      evidence.push(this.createEvidence("spf_record_present", false, "WARN", "No SPF TXT records"));
    }
    try {
      const dmarc = await dns.resolveTxt("_dmarc." + domain);
      const flat = dmarc.flat().map(t => t.toLowerCase());
      const dmarcPresent = flat.some(r => r.startsWith("v=dmarc1"));
      evidence.push(this.createEvidence("dmarc_record_present", dmarcPresent, dmarcPresent ? "PASS" : "WARN", "DMARC assessment"));
    } catch {
      evidence.push(this.createEvidence("dmarc_record_present", false, "WARN", "No DMARC TXT records"));
    }
    return evidence;
  }

  private createEvidence(claim: string, value: unknown, status: "PASS" | "WARN" | "FAIL", message: string): EvidenceItem {
    return {
      id: "ev_dns_" + Math.random().toString(36).substring(2, 11),
      validator: this.id,
      source: VALIDATOR_SOURCE,
      claim,
      value,
      confidence: 1.0,
      status,
      observedAt: new Date().toISOString(),
      metadata: { engineVersion: this.version, message }
    };
  }
}