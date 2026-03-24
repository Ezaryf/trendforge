export function formatCompact(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function relativeDate(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const days = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  return `${days}d ago`;
}
