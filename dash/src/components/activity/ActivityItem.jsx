import { CheckCircle2, Upload, RefreshCw } from "lucide-react";

const ICON_MAP = {
  status: RefreshCw,
  approval: CheckCircle2,
  upload: Upload,
};

export default function ActivityItem({ item, isLast }) {
  const Icon = ICON_MAP[item.type] || RefreshCw;

  return (
    <div className="relative flex gap-3.5 pb-6 last:pb-0">
      {!isLast && (
        <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-surface-border" />
      )}
      <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface-card text-surface-muted">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </div>
      <div className="pt-0.5">
        <p className="text-[0.9rem] font-medium text-surface-fg">{item.text}</p>
        <p className="mt-0.5 text-xs text-surface-muted">{item.timestamp}</p>
      </div>
    </div>
  );
}
