import { EvidenceItem, ValidatorPlugin } from './types.js';

export * from './types.js';

export class ValidatorRegistryEngine {
  private plugins = new Map<string, ValidatorPlugin>();

  public register(plugin: ValidatorPlugin): void {
    if (!plugin || !plugin.id || !plugin.version || !plugin.category) {
      throw new Error(`Invalid structural contract for plugin: ${plugin?.id || 'Unknown'}`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  public getPlugin(id: string): ValidatorPlugin | undefined {
    return this.plugins.get(id);
  }

  public listPlugins(): ValidatorPlugin[] {
    return Array.from(this.plugins.values());
  }

  public validateEvidence(item: EvidenceItem): void {
    const requiredKeys: (keyof EvidenceItem)[] = [
      'id', 'validator', 'source', 'claim', 
      'value', 'confidence', 'status', 'observedAt'
    ];

    for (const key of requiredKeys) {
      if (item[key] === undefined || item[key] === null) {
        throw new Error(`Pinnacle Evidence Contract Violation: Missing field '${key}'`);
      }
    }

    if (!['PASS', 'WARN', 'FAIL'].includes(item.status)) {
      throw new Error(`Pinnacle Evidence Contract Violation: Invalid status value '${item.status}'`);
    }

    if (typeof item.confidence !== 'number' || item.confidence < 0 || item.confidence > 1) {
      throw new Error(`Pinnacle Evidence Contract Violation: Confidence rating must be a float between 0.0 and 1.0`);
    }
  }
}
