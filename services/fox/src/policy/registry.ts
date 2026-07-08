import type {
  CapabilityPolicy
} from "./types.js";


const policies: Record<
  string,
  CapabilityPolicy
> = {

  vertex: {
    capability: "vertex",
    allowedTenants: [
      "tenant-test"
    ]
  }

};


export function resolvePolicy(
  capability: string
): CapabilityPolicy {

  const policy =
    policies[capability];

  if (!policy) {
    throw new Error(
      `No policy found for capability: ${capability}`
    );
  }

  return policy;
}
