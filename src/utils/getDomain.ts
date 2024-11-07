export function getDomain(domain: string) {
  const { hostname } = new URL(domain);
  return hostname;
}
