export default function StatCard({ label, value, accent = false }) {
  return (
    <div className="rounded-card border border-surface-border bg-surface-card px-6 py-5 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-soft">
      <p className="mb-2 text-eyebrow font-semibold uppercase tracking-[0.2em] text-surface-muted">
        {label}
      </p>
      <p
        className={
          "font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl " +
          (accent ? "text-brand-orange" : "text-surface-fg")
        }
      >
        {value}
      </p>
    </div>
  );
}
