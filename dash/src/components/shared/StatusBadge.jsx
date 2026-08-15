import { Badge } from "@/components/ui/badge";

const STATUS_MAP = {
  "not-started": { label: "Not Started", variant: "neutral" },
  planned: { label: "Planned", variant: "neutral" },
  "in-progress": { label: "In Progress", variant: "progress" },
  "client-review": { label: "Client Review", variant: "progress" },
  completed: { label: "Completed", variant: "success" },
  blocked: { label: "Blocked", variant: "blocked" },
};

export default function StatusBadge({ status, className }) {
  const config = STATUS_MAP[status] || { label: status, variant: "neutral" };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
