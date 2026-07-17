import { PipelineResult } from "../pipeline.js";
import { SYSTEM_FOOTER } from "./footer.config.js";

export class ResultsRenderer {
  public renderHTMLWorkspace(res: PipelineResult): string {
    return [
      "==================================================",
      " PINNACLE RUNTIME VALIDATOR V2 - INSPECTION WORKSPACE",
      "==================================================",
      "Validation ID: " + res.validationId,
      "Business Name: " + res.businessName,
      "Timestamp    : " + (res.assessment?.generatedAt || new Date().toISOString()),
      "--------------------------------------------------",
      "[TRUST INDICATOR]",
      "  SCORE: " + (res.assessment?.score ?? "N/A") + " | RATING: " + (res.assessment?.rating ?? "UNKNOWN"),
      "--------------------------------------------------",
      "[AI EXECUTIVE SUMMARY]",
      "  " + (res.summary?.headline ?? "No summary generated."),
      "--------------------------------------------------",
      "[EVIDENCE LOGS]",
      res.evidence.map(e => "  * [" + e.status + "] " + e.validator + "." + e.claim + " -> " + e.value).join("\n"),
      "--------------------------------------------------",
      SYSTEM_FOOTER.line1 + " | " + SYSTEM_FOOTER.line3
    ].join("\n");
  }

  public generatePlainTXTReport(res: PipelineResult): string {
    return this.renderHTMLWorkspace(res);
  }

  public generateCSVString(res: PipelineResult[]): string {
    const headers = "Validation ID,Business Name,Trust Score,Risk Rating,Timestamp";
    const rows = res.map(r => {
      const id = r.validationId;
      const bname = r.businessName;
      const score = r.assessment?.score ?? 0;
      const rating = r.assessment?.rating ?? "UNKNOWN";
      const ts = r.assessment?.generatedAt || "";
      return id + "," + bname + "," + score + "," + rating + "," + ts;
    });
    return [headers, ...rows].join("\n");
  }
}