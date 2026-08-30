export default function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-eyebrow font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="font-display text-display-sm font-bold text-surface-fg">{title}</h2>
        )}
      </div>
      {action}
    </div>
  );
}
