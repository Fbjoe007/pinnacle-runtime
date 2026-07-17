import { PipelineResult } from "../pipeline.js";
import { SYSTEM_FOOTER } from "./footer.config.js";
import { PLATFORM_IDENTITY } from "./routes.config.js";

export interface DashboardMetrics {
  totalValidations: number;
  averageTrustScore: number;
  healthyCount: number;
  cautionCount: number;
  highRiskCount: number;
  activeQueueDepth: number;
  workerCount: number;
}

export class DashboardRenderer {
  public renderSystemMetrics(metrics: DashboardMetrics): string {
    return [
      `=== ${PLATFORM_IDENTITY.title} ===`,
      `Host Environment: ${PLATFORM_IDENTITY.domain}`,
      `--------------------------------------------------`,
      `[TRUST OVERVIEW]`,
      `  * Total Validations Run   : ${metrics.totalValidations}`,
      `  * Average Workspace Score : ${metrics.averageTrustScore}/100`,
      `  * Healthy Footprints      : ${metrics.healthyCount}`,
      `  * Caution Indicators      : ${metrics.cautionCount}`,
      `  * High-Risk Discrepancies : ${metrics.highRiskCount}`,
      ``,
      `[SYSTEM OPERATIONS]`,
      `  * Current Queue Depth     : ${metrics.activeQueueDepth} active jobs`,
      `  * Worker Allocations      : ${metrics.workerCount} operational threads`,
      `--------------------------------------------------`,
      `${SYSTEM_FOOTER.line1} | ${SYSTEM_FOOTER.line2}`
    ].join("\n");
  }
}