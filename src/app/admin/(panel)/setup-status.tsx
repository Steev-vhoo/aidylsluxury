import { serviceStatus } from "@/lib/setup-status";

export function SetupStatus() {
  const services = serviceStatus();
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="mb-3 font-bold">Setup checklist</h2>
      <ul className="flex flex-col divide-y divide-[#f4ede1]">
        {services.map((s) => (
          <li key={s.name} className="flex items-start gap-3 py-3 text-sm">
            <span aria-hidden className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${s.ok ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900"}`}>
              {s.ok ? "✓" : "!"}
            </span>
            <span className="flex flex-col gap-0.5">
              <strong>{s.name} <span className="sr-only">{s.ok ? "(connected)" : "(not connected)"}</span></strong>
              <span className="text-muted">{s.detail}</span>
              {!s.ok && s.fix && <span className="text-xs text-gold-text">{s.fix}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
