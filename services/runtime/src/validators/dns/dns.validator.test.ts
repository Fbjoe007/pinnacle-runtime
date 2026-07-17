import { describe, test, expect, vi } from "vitest";
import { DNSValidator } from "./dns.validator.js";
import { ValidatorRegistryEngine } from "@pinnacle/validator-sdk";
import * as dns from "dns/promises";

vi.mock("dns/promises", () => ({
  resolve4: vi.fn(),
  resolve6: vi.fn(),
  resolveMx: vi.fn(),
  resolveTxt: vi.fn()
}));

describe("DNS Validator Epic 3 Unit Suite", () => {
  const validator = new DNSValidator();
  const engine = new ValidatorRegistryEngine();

  test("Successful Domain - Schema Verification", async () => {
    vi.mocked(dns.resolve4).mockResolvedValue(["127.0.0.1"]);
    vi.mocked(dns.resolve6).mockResolvedValue(["::1"]);
    vi.mocked(dns.resolveMx).mockResolvedValue([{ exchange: "mail.test.com", priority: 10 }]);
    vi.mocked(dns.resolveTxt).mockResolvedValue([["v=spf1 include:_spf.google.com ~all"]]);

    const results = await validator.execute({ domain: "pinnacle.com" });
    expect(results.length).toBeGreaterThanOrEqual(4);
    
    // Ensure every single item safely runs through our core sdk compiler engine rules
    for (const item of results) {
      expect(() => engine.validateEvidence(item)).not.toThrow();
    }
  });

  test("Missing Records produce controlled WARN states", async () => {
    vi.mocked(dns.resolve4).mockResolvedValue(["127.0.0.1"]);
    vi.mocked(dns.resolve6).mockRejectedValue(new Error("NODATA"));
    vi.mocked(dns.resolveMx).mockRejectedValue(new Error("NODATA"));
    vi.mocked(dns.resolveTxt).mockRejectedValue(new Error("NODATA"));

    const results = await validator.execute({ domain: "missing-records.com" });
    const mxResult = results.find(r => r.claim === "domain_has_mail_exchange");
    const spfResult = results.find(r => r.claim === "spf_record_present");

    expect(mxResult?.status).toBe("WARN");
    expect(spfResult?.status).toBe("WARN");
  });

  test("Invalid Domain produces controlled FAIL without crashing pipeline", async () => {
    const err = new Error("ENOTFOUND");
    (err as any).code = "ENOTFOUND";
    vi.mocked(dns.resolve4).mockRejectedValue(err);

    const results = await validator.execute({ domain: "doesnotexist.invalid" });
    const resolutionResult = results.find(r => r.claim === "domain_resolution");
    
    expect(resolutionResult?.status).toBe("FAIL");
    expect(resolutionResult?.value).toBe(false);
  });
});