export interface EvidenceItem {
  id: string;
  validator: string;
  source: string;
  claim: string;
  value: unknown;
  confidence: number;
  status: "PASS" | "WARN" | "FAIL";
  observedAt: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ValidatorPlugin {
  id: string;
  version: string;
  category: "connectivity" | "identity" | "geography" | "compliance";
  execute(input: unknown): Promise<EvidenceItem[]>;
}

export interface ValidationRegistry {
  register(plugin: ValidatorPlugin): void;
  getPlugin(id: string): ValidatorPlugin | undefined;
  listPlugins(): ValidatorPlugin[];
}
