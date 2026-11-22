const tones: Record<string, string> = {
  new: "bg-cream-2 text-[#5a3e1b]",
  contacted: "bg-amber-100 text-amber-900",
  quoted: "bg-[#f3e3c3] text-[#5a3e1b]",
  booked: "bg-green-100 text-green-900",
  closed: "bg-slate-200 text-slate-800",
  pending: "bg-amber-100 text-amber-900",
  requested: "bg-cream-2 text-[#5a3e1b]",
  paid: "bg-green-100 text-green-900",
  fulfilled: "bg-slate-200 text-slate-800",
  failed: "bg-red-100 text-red-900",
  cancelled: "bg-red-100 text-red-900",
  live: "bg-green-100 text-green-900",
  draft: "bg-slate-200 text-slate-800",
};

export function StatusPill({ status }: { status: string }) {
  return <span className={`inline-flex min-h-6.5 items-center rounded-full px-2.5 text-xs font-semibold capitalize ${tones[status] ?? "bg-slate-200"}`}>{status}</span>;
}
