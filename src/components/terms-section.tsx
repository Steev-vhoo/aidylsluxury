import { terms } from "@/lib/content";
import { DraftBadge } from "./ui";

export function TermsSection() {
  return (
    <section id="terms" className="scroll-mt-24 bg-cream py-20">
      <div className="container-x flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-3xl font-bold">Booking, Payment and Cancellation Terms</h2>
          <DraftBadge />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {terms.map((t) => (
            <div key={t.h} className="flex flex-col gap-3 rounded-2xl bg-white p-6">
              <strong className="font-display text-[17px]">{t.h}</strong>
              <ul className="flex list-disc flex-col gap-2 pl-4.5 text-sm leading-relaxed text-[#4e3f2e]">
                {t.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
