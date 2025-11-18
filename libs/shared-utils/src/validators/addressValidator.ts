export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidEnsName(name: string): boolean {
  return /^[a-z0-9-]+\.eth$/i.test(name);
}

