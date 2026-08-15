import { Sparkles } from "lucide-react";

export default function CurrentWorkCard({ work, updatedAt }) {
  return (
    <div className="theme-dark section rounded-card p-7 sm:p-9">
      <div className="flex items-center gap-2 text-brand-orangeSoft">
        <Sparkles className="h-4 w-4" strokeWidth={2} />
        <p className="text-eyebrow font-semibold uppercase tracking-[0.22em]">
          Currently Working On
        </p>
      </div>

      <h3 className="mt-4 font-display text-display-sm font-bold text-surface-fg sm:text-3xl">
        {work.title}
      </h3>

      <span className="mt-3 inline-flex rounded-pill border border-brand-orange/40 bg-brand-orange/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-orangeSoft">
        {work.service}
      </span>

      <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-surface-muted">
        {work.description}
      </p>

      <p className="mt-5 text-xs text-[color-mix(in_srgb,var(--surface-muted)_70%,transparent)]">Updated {updatedAt}</p>
    </div>
  );
}
