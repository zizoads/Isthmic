export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function isJsonResponse(res: any) {
  if (!res || typeof res.ok !== 'boolean') return false;
  if (!res.ok) return false;
  const contentType = res.headers?.get?.('content-type');
  return !!contentType && contentType.includes('application/json');
}

export function formatPercentage(value: number, decimals: number = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}
