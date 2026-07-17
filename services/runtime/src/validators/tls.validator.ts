import https from "https";
import tls from "tls";
import type { ValidatorResult, EvidenceItem } from "../core/types.js";

export async function validateTls(domain: string): Promise<ValidatorResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  const evidence: EvidenceItem[] = [];
  const warnings: string[] = [];
  let passed = false;

  return new Promise((resolve) => {
    const options = {
      hostname: domain,
      port: 443,
      method: "GET",
      rejectUnauthorized: false,
      timeout: 4500
    };

    const req = https.request(options, (res) => {
      const socket = res.socket as tls.TLSSocket;
      const cert = socket.getPeerCertificate();

      if (cert && Object.keys(cert).length > 0) {
        const validTo = new Date(cert.valid_to).getTime();
        const isExpired = Date.now() > validTo;
        passed = !isExpired && res.statusCode !== undefined && res.statusCode < 400;

        evidence.push({
          code: "TLS_CERTIFICATE_VALIDATED",
          value: { issuer: cert.issuer.CN, valid_to: cert.valid_to, expired: isExpired },
          description: `Issued by ${cert.issuer.CN}. Expiration timestamp: ${cert.valid_to}`
        });
      } else {
        passed = false;
        evidence.push({
          code: "TLS_CERTIFICATE_MISSING",
          value: true,
          description: "No peer certificate returned from destination handshake."
        });
      }

      req.destroy();
      finalize();
    });

    req.on("error", (err: any) => {
      passed = false;
      evidence.push({
        code: "HTTPS_REACHABILITY_FAILED",
        value: err.message,
        description: `Connection dropped: ${err.code || "UNKNOWN"}`
      });
      finalize();
    });

    req.on("timeout", () => {
      req.destroy();
      passed = false;
      evidence.push({
        code: "HTTPS_HANDSHAKE_TIMEOUT",
        value: true
      });
      finalize();
    });

    req.end();

    function finalize() {
      const duration = Date.now() - startTime;
      resolve({
        validator: "tls_validator",
        passed,
        status: passed ? "passed" : "failed",
        confidence: 0.90,
        score: passed ? 30 : 0,
        maxScore: 30,
        evidence,
        warnings,
        execution_ms: duration,
        started_at: startedAt,
        finished_at: new Date().toISOString()
      });
    }
  });
}
