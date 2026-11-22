export function ghs(pesewas: number | null | undefined, opts: { decimals?: boolean } = {}) {
  if (pesewas == null) return "GH₵ —";
  const v = pesewas / 100;
  return `GH₵ ${v.toLocaleString("en-GH", {
    minimumFractionDigits: opts.decimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function fromPrice(prices: (number | null)[]) {
  const known = prices.filter((p): p is number => p != null);
  if (!known.length) return "Price coming soon";
  const min = Math.min(...known);
  return known.length > 1 && known.some((p) => p !== min) ? `From ${ghs(min)}` : ghs(min);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
