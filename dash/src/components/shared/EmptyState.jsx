export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-card border border-dashed border-surface-border px-6 py-14 text-center">
      <p className="font-display text-base font-bold text-surface-fg">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-surface-muted">{description}</p>
      )}
    </div>
  );
}
