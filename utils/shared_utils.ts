export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function isJsonResponse(res: Response) {
  return res.ok && res.headers.get('content-type')?.includes('application/json');
}

export function formatPercentage(value: number, decimals: number = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}
