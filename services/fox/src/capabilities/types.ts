export interface CapabilityDefinition {
  /**
   * Unique capability identifier.
   */
  name: string;

  /**
   * Provider responsible for executing this capability.
   */
  provider: string;

  /**
   * Human-readable description.
   */
  description: string;

  /**
   * Capability version.
   */
  version: string;

  /**
   * Whether this capability is available for execution.
   */
  enabled: boolean;

  /**
   * Optional roles allowed to execute this capability.
   */
  allowedRoles?: readonly string[];
}
