import { describe, test, expect, vi } from "vitest";
import { HTTPSValidator } from "./https.validator.js";
import { ValidatorRegistryEngine } from "@pinnacle/validator-sdk";
import * as https from "https";
import { EventEmitter } from "events";

vi.mock("https", () => ({
  request: vi.fn()
}));

describe("HTTPS Validator Epic 4 Test Suite", () => {
  const validator = new HTTPSValidator();
  const engine = new ValidatorRegistryEngine();

  test("Test 1 & 4: Healthy HTTPS website and contract validation", async () => {
    const mockReq = Object.assign(new EventEmitter(), { end: vi.fn(), destroy: vi.fn() });
    const mockRes = Object.assign(new EventEmitter(), {
      statusCode: 200,
      socket: {
        authorized: true,
        getPeerCertificate: () => ({
          valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
    });

    vi.mocked(https.request).mockImplementation((options: any, callback: any) => {
      if (callback) callback(mockRes as any);
      return mockReq as any;
    });

    const results = await validator.execute({ url: "https://safe-endpoint.pinnacle.com" });
    expect(results.length).toBeGreaterThanOrEqual(3);

    const reachable = results.find(r => r.claim === "https_endpoint_reachable");
    const certValid = results.find(r => r.claim === "tls_certificate_valid");

    expect(reachable?.status).toBe("PASS");
    expect(certValid?.status).toBe("PASS");

    for (const item of results) {
      expect(() => engine.validateEvidence(item)).not.toThrow();
    }
  });

  test("Test 2: Expired/invalid certificate returns FAIL state", async () => {
    const mockReq = Object.assign(new EventEmitter(), { end: vi.fn() });
    const mockRes = Object.assign(new EventEmitter(), {
      statusCode: 200,
      socket: {
        authorized: false,
        getPeerCertificate: () => ({
          valid_to: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
    });

    vi.mocked(https.request).mockImplementation((options: any, callback: any) => {
      if (callback) callback(mockRes as any);
      return mockReq as any;
    });

    const results = await validator.execute({ url: "https://expired-cert.pinnacle.com" });
    const certValid = results.find(r => r.claim === "tls_certificate_valid");
    const certExpiry = results.find(r => r.claim === "tls_certificate_expiration");

    expect(certValid?.status).toBe("FAIL");
    expect(certExpiry?.status).toBe("FAIL");
  });

  test("Test 3: Unreachable or network breakdown failure handler", async () => {
    const mockReq = Object.assign(new EventEmitter(), { end: vi.fn() });

    vi.mocked(https.request).mockImplementation(() => {
      setTimeout(() => {
        mockReq.emit("error", new Error("ENOTFOUND"));
      }, 10);
      return mockReq as any;
    });

    const results = await validator.execute({ url: "https://unreachable.pinnacle.invalid" });
    const reachable = results.find(r => r.claim === "https_endpoint_reachable");
    
    expect(reachable?.status).toBe("FAIL");
  });
});