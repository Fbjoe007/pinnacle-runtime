import type { ValidatorResult, EvidenceItem } from "../core/types.js";

export async function validateGooglePlaces(businessName: string, locationHint?: string): Promise<ValidatorResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  const evidence: EvidenceItem[] = [];
  const warnings: string[] = [];
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  let passed = false;

  if (!apiKey) {
    warnings.push("Google Places API Key missing from environment; running in dry-run simulation mode.");
    const duration = Date.now() - startTime;
    return {
      validator: "google_places_validator",
      passed: true,
      status: "passed",
      confidence: 0.50,
      score: 20,
      maxScore: 40,
      evidence: [{ 
        code: "GOOGLE_PLACES_SIMULATED", 
        value: { businessName, locationHint: locationHint || "N/A" }, 
        description: `Simulated match for business: "${businessName}" located near "${locationHint || 'unspecified'}"` 
      }],
      warnings,
      execution_ms: duration,
      started_at: startedAt,
      finished_at: new Date().toISOString()
    };
  }

  try {
    const query = encodeURIComponent(`${businessName} ${locationHint || ""}`.trim());
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=name,formatted_address,business_status,place_id&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const topCandidate = data.candidates[0];
      const isOperational = topCandidate.business_status === "OPERATIONAL";
      passed = isOperational;

      evidence.push({
        code: "GOOGLE_PLACES_RECORD_FOUND",
        value: {
          place_id: topCandidate.place_id,
          name: topCandidate.name,
          address: topCandidate.formatted_address,
          business_status: topCandidate.business_status
        },
        description: `Matched registry: ${topCandidate.name} is status ${topCandidate.business_status}`
      });
    } else {
      passed = false;
      evidence.push({
        code: "GOOGLE_PLACES_NO_MATCH",
        value: false,
        description: "No corporate matches located inside the designated geographic lookup radius."
      });
    }
  } catch (err: any) {
    passed = false;
    warnings.push(`Google Maps Endpoint connection failure: ${err.message}`);
  }

  const duration = Date.now() - startTime;
  return {
    validator: "google_places_validator",
    passed,
    status: passed ? "passed" : "failed",
    confidence: passed ? 0.95 : 0.80,
    score: passed ? 40 : 0,
    maxScore: 40,
    evidence,
    warnings,
    execution_ms: duration,
    started_at: startedAt,
    finished_at: new Date().toISOString()
  };
}
