import { describe, test, expect, beforeEach } from 'vitest';
import { ValidatorRegistryEngine, EvidenceItem, ValidatorPlugin } from '../index.js';

describe('Evidence Contract v1 & Plugin Framework', () => {
  let engine: ValidatorRegistryEngine;

  beforeEach(() => {
    engine = new ValidatorRegistryEngine();
  });

  test('should successfully register a structurally valid plugin', () => {
    const validPlugin: ValidatorPlugin = {
      id: 'dns-validator',
      version: '1.0.0',
      category: 'connectivity',
      execute: async () => []
    };

    engine.register(validPlugin);
    expect(engine.getPlugin('dns-validator')).toBe(validPlugin);
    expect(engine.listPlugins()).toContain(validPlugin);
  });

  test('should reject plugins missing mandatory structural fields', () => {
    const brokenPlugin = {
      id: 'broken',
      version: '1.0.0'
      // missing category
    } as unknown as ValidatorPlugin;

    expect(() => engine.register(brokenPlugin)).toThrow('Invalid structural contract for plugin');
  });

  test('should accept perfectly schema-compliant evidence items', () => {
    const perfectItem: EvidenceItem = {
      id: 'ev_001',
      validator: 'dns-validator',
      source: '8.8.8.8',
      claim: 'MX record lookup',
      value: { mx: ['mail.pinnacle.com'] },
      confidence: 1.0,
      status: 'PASS',
      observedAt: new Date().toISOString()
    };

    expect(() => engine.validateEvidence(perfectItem)).not.toThrow();
  });

  test('should reject evidence items with missing key properties', () => {
    const brokenItem = {
      id: 'ev_002',
      validator: 'dns-validator',
      claim: 'MX record lookup'
      // missing source, value, status, etc.
    } as unknown as EvidenceItem;

    expect(() => engine.validateEvidence(brokenItem)).toThrow('Pinnacle Evidence Contract Violation: Missing field');
  });

  test('should enforce status values to match allowed enum strings', () => {
    const illegalStatusItem: EvidenceItem = {
      id: 'ev_003',
      validator: 'dns-validator',
      source: '8.8.8.8',
      claim: 'MX record lookup',
      value: {},
      confidence: 0.9,
      status: 'UNKNOWN' as any, // Violation
      observedAt: new Date().toISOString()
    };

    expect(() => engine.validateEvidence(illegalStatusItem)).toThrow('Invalid status value');
  });

  test('should catch confidence values outside of the [0.0, 1.0] threshold', () => {
    const lowConfidenceItem: EvidenceItem = {
      id: 'ev_004',
      validator: 'dns-validator',
      source: '8.8.8.8',
      claim: 'MX record lookup',
      value: {},
      confidence: -0.1, // Violation
      status: 'WARN',
      observedAt: new Date().toISOString()
    };

    const highConfidenceItem = { ...lowConfidenceItem, confidence: 1.5 };

    expect(() => engine.validateEvidence(lowConfidenceItem)).toThrow('Confidence rating must be a float between 0.0 and 1.0');
    expect(() => engine.validateEvidence(highConfidenceItem)).toThrow('Confidence rating must be a float between 0.0 and 1.0');
  });
});
