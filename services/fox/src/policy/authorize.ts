import {
  resolvePolicy
} from "./registry.js";


export function authorizeCapability(
  tenantId: string,
  capability: string
): boolean {

  const policy =
    resolvePolicy(capability);


  if (
    !policy.allowedTenants.includes(
      tenantId
    )
  ) {
    throw new Error(
      `Tenant ${tenantId} is not authorized for ${capability}`
    );
  }


  return true;
}
