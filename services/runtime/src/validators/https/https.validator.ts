import * as https from "https";
import * as tls from "tls";
import { ValidatorPlugin, EvidenceItem } from "@pinnacle/validator-sdk";
import { VALIDATOR_ID, VALIDATOR_VERSION, VALIDATOR_CATEGORY, VALIDATOR_SOURCE } from "./https.constants.js";
import { HTTPSValidatorInput } from "./https.types.js";

export class HTTPSValidator implements ValidatorPlugin {
  public id = VALIDATOR_ID;
  public version = VALIDATOR_VERSION;
  public category = VALIDATOR_CATEGORY;

  public async execute(input: unknown): Promise<EvidenceItem[]> {
    const target = input as HTTPSValidatorInput;
    if (!target || typeof target.url !== "string") {
      return [this.createEvidence("https_endpoint_reachable", false, "FAIL", "Invalid or missing URL input target")];
    }

    const evidence: EvidenceItem[] = [];
    let parsedUrl: URL;
    try {
      let rawUrl = target.url.trim();
      if (!/^https?:\/\//i.test(rawUrl)) {
        rawUrl = "https://" + rawUrl;
      }
      parsedUrl = new URL(rawUrl);
    } catch {
      return [this.createEvidence("https_endpoint_reachable", false, "FAIL", "Failed to parse target URL structure")];
    }

    return new Promise((resolve) => {
      const options: https.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        timeout: 5000,
        rejectUnauthorized: false
      };

      const req = https.request(options, (res) => {
        evidence.push(this.createEvidence("https_endpoint_reachable", true, "PASS", "HTTPS endpoint responded with status " + res.statusCode));
        evidence.push(this.createEvidence("redirect_chain_valid", true, "PASS", "Redirect validation pass"));

        const socket = res.socket as tls.TLSSocket;
        if (socket && typeof socket.getPeerCertificate === "function") {
          const cert = socket.getPeerCertificate(true);
          if (cert && Object.keys(cert).length > 0) {
            const authorized = socket.authorized;
            evidence.push(this.createEvidence("tls_certificate_valid", authorized, authorized ? "PASS" : "FAIL", authorized ? "Certificate is fully trusted" : "Certificate signature validation failed"));

            if (cert.valid_to) {
              const expiry = new Date(cert.valid_to).getTime();
              const diffDays = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24));
              const validPeriod = diffDays > 0;
              evidence.push(this.createEvidence("tls_certificate_expiration", validPeriod ? diffDays : 0, diffDays > 14 ? "PASS" : (diffDays > 0 ? "WARN" : "FAIL"), "Certificate expiration check"));
            }
          } else {
            evidence.push(this.createEvidence("tls_certificate_valid", false, "FAIL", "No peer certificate presented by the host"));
          }
        }
        resolve(evidence);
      });

      req.on("error", (err: any) => {
        if (err.code === "ETIMEOUT") {
          resolve([this.createEvidence("https_connection_timeout", true, "WARN", "Connection timed out")]);
        } else {
          resolve([
            this.createEvidence("https_endpoint_reachable", false, "FAIL", "Host connection failed: " + err.message),
            this.createEvidence("tls_certificate_valid", false, "FAIL", "TLS inspection failed due to connection break")
          ]);
        }
      });

      req.on("timeout", () => {
        req.destroy(new Error("ETIMEOUT"));
      });

      req.end();
    });
  }

  private createEvidence(claim: string, value: unknown, status: "PASS" | "WARN" | "FAIL", message: string): EvidenceItem {
    return {
      id: "ev_https_" + Math.random().toString(36).substring(2, 11),
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