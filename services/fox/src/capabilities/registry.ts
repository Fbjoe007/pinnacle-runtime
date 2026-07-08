import type {
  CapabilityDefinition
} from "./types.js";


const capabilities: Record<
  string,
  CapabilityDefinition
> = {

  vertex: {

    name: "vertex",

    provider: "vertex",

    description:
      "General purpose AI language capability executed through the Vertex provider boundary.",

    version:
      "1.0.0",

    enabled:
      true

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


  if (!definition.enabled) {

    throw new Error(
      `Capability disabled: ${capability}`
    );

  }


  return definition;

}


export function listCapabilities(): CapabilityDefinition[] {

  return Object.values(
    capabilities
  ).filter(
    capability =>
      capability.enabled
  );

}
