import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ value, showLabel = true, className }) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        {showLabel && (
          <span className="font-display text-sm font-bold text-surface-fg">{value}%</span>
        )}
      </div>
      <Progress value={value} />
    </div>
  );
}
