import { describe, test, expect } from "vitest";
import { GoogleBusinessValidator } from "./google-business.validator.js";
import { ValidatorRegistryEngine } from "@pinnacle/validator-sdk";

describe("Google Business Validator Epic 5 Test Suite", () => {
  const validator = new GoogleBusinessValidator();
  const engine = new ValidatorRegistryEngine();

  test("Test 1 & 5: Active Business profile and contract validation", async () => {
    const results = await validator.execute({
      businessName: "Pinnacle Enterprise Systems",
      address: "123 Sovereign Way, Austin, TX",
      website: "https://pinnacle.com"
    });

    expect(results.length).toBe(4);
    expect(results.find(r => r.claim === "business_profile_exists")?.status).toBe("PASS");
    expect(results.find(r => r.claim === "business_operational_status")?.status).toBe("PASS");
    expect(results.find(r => r.claim === "business_location_verified")?.status).toBe("PASS");
    expect(results.find(r => r.claim === "website_matches_business_profile")?.status).toBe("PASS");

    for (const item of results) {
      expect(() => engine.validateEvidence(item)).not.toThrow();
    }
  });

  test("Test 2: Closed Business profile results in FAIL state", async () => {
    const results = await validator.execute({
      businessName: "Defunct Closed Retailer Inc"
    });

    expect(results.find(r => r.claim === "business_operational_status")?.status).toBe("FAIL");
    expect(results.find(r => r.claim === "business_location_verified")?.status).toBe("FAIL");
  });

  test("Test 3: Missing Business profile generates isolated failure evidence", async () => {
    const results = await validator.execute({
      businessName: "Missing Nonexistent Company LLC"
    });

    expect(results.length).toBe(1);
    expect(results[0].claim).toBe("business_profile_exists");
    expect(results[0].status).toBe("FAIL");
  });

  test("Test 4: Website mismatch generates structured WARN state", async () => {
    const results = await validator.execute({
      businessName: "Mismatch Corporation Solutions",
      website: "https://target-input-site.com"
    });

    const websiteCheck = results.find(r => r.claim === "website_matches_business_profile");
    expect(websiteCheck?.value).toBe(false);
    expect(websiteCheck?.status).toBe("WARN");
  });
});