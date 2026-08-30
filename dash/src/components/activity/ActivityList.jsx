import ActivityItem from "./ActivityItem";

export default function ActivityList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-surface-border px-6 py-10 text-center">
        <p className="font-display text-sm font-bold text-surface-fg">No Recent Activity</p>
        <p className="mt-1 text-sm text-surface-muted">Project updates will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item, i) => (
        <ActivityItem key={item.id} item={item} isLast={i === items.length - 1} />
      ))}
    </div>
  );
}
