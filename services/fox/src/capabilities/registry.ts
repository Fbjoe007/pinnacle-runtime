import type {
  CapabilityDefinition
} from "./types.js";

const capabilities: Record<
  string,
  CapabilityDefinition
> = {
  vertex: {
    name: "vertex",
    provider: "vertex"
  }
};

export function resolveCapability(
  capability: string
): CapabilityDefinition {

  const definition =
    capabilities[capability];

  if (!definition) {
    throw new Error(
      `Unknown capability: ${capability}`
    );
  }

  return definition;
}
