import { ArrowRight, FileCheck2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActionRequiredCard({ item }) {
  const isReview = item.type === "review";
  const Icon = isReview ? FileCheck2 : Upload;

  return (
    <div className="relative overflow-hidden rounded-card border border-brand-orange/25 bg-surface-card p-6 shadow-soft transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-glow sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-orange/10 blur-2xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="mb-1.5 text-eyebrow font-semibold uppercase tracking-[0.2em] text-brand-orange">
              {isReview ? "Action Required" : "Waiting For You"}
            </p>
            <h3 className="font-display text-lg font-bold text-surface-fg sm:text-xl">
              {item.title}
            </h3>
            {isReview ? (
              <p className="mt-1 text-sm text-surface-muted">{item.description}</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {item.needs.map((need) => (
                  <li
                    key={need}
                    className="flex items-center gap-2 text-sm text-surface-muted"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brand-orange" />
                    {need}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Button size="default" className="shrink-0 self-start sm:self-center">
          {item.cta}
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
        </Button>
      </div>
    </div>
  );
}
