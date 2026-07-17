import { PLATFORM_IDENTITY } from "./routes.config.js";

export interface BatchProgressMetrics {
  batchId: string;
  totalLeads: number;
  completed: number;
  failed: number;
  remaining: number;
  activeWorkers: number;
  throughputPerSecond: number;
}

export class WorkflowRenderer {
  public renderSingleExecutionProgress(businessName: string, domain: string, activeStepIndex: number): string {
    const steps = [
      { label: "DNS Analysis", key: "DNS" },
      { label: "HTTPS Inspection", key: "HTTPS" },
      { label: "Google Business Verification", key: "GOOGLE" },
      { label: "Deterministic Risk Calculation", key: "RISK" },
      { label: "AI Executive Summary Generation", key: "SUMMARY" }
    ];
    const pipelineTrace = steps.map((step, idx) => {
      if (idx < activeStepIndex) return `  ✓ ${step.label}`;
      if (idx === activeStepIndex) return `  ◌ ${step.label} (Processing...)`;
      return `  ─ ${step.label} (Queued)`;
    }).join("\n");
    return [
      `[SINGLE PIPELINE INGESTION RUN]`,
      `Target Entity : ${businessName}`,
      `Target Domain : ${domain}`,
      `--------------------------------------------------`,
      pipelineTrace,
      `--------------------------------------------------`,
      `Host Platform : ${PLATFORM_IDENTITY.domain}`
    ].join("\n");
  }

  public renderBulkBatchStatus(metrics: BatchProgressMetrics): string {
    const progressPercent = Math.floor((metrics.completed / metrics.totalLeads) * 100);
    const estRemainingSeconds = metrics.throughputPerSecond > 0 
      ? Math.ceil(metrics.remaining / metrics.throughputPerSecond) 
      : 0;
    return [
      `[ENTERPRISE BATCH PROCESSING ENGINE]`,
      `Batch Identifier  : ${metrics.batchId}`,
      `Operational Scale : Up to 100,000 leads / 5M daily capacity target`,
      `--------------------------------------------------`,
      `  * Total Input Records : ${metrics.totalLeads.toLocaleString()}`,
      `  * Complete Processing : ${metrics.completed.toLocaleString()} (${progressPercent}%)`,
      `  * Remaining Buffer    : ${metrics.remaining.toLocaleString()}`,
      `  * Pipeline Failures   : ${metrics.failed.toLocaleString()}`,
      `--------------------------------------------------`,
      `[STREAM METRICS]`,
      `  * Active Workers      : ${metrics.activeWorkers} concurrent threads`,
      `  * Steady Throughput   : ${metrics.throughputPerSecond.toFixed(2)} validations/sec`,
      `  * Time to Completion  : Approx. ${estRemainingSeconds} seconds remaining`,
      `--------------------------------------------------`
    ].join("\n");
  }
}