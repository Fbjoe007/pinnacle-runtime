export interface RuntimeCapability {
  name: string;
  enabled: boolean;
}

const capabilities: RuntimeCapability[] = [
  {
    name: "vertex",
    enabled: true
  }
];

export function listCapabilities(): RuntimeCapability[] {
  return capabilities;
}
