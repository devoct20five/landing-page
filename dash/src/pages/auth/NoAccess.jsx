import { useNavigate } from "react-router-dom";
import {
  ShieldX,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

export default function NoAccess() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full items-center justify-center bg-surface-bg p-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <ShieldX
            className="h-7 w-7 text-red-500"
            strokeWidth={2}
          />
        </div>

        {/* Heading */}
        <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
          Access Restricted
        </p>

        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg">
          You don't have access
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-surface-muted">
          You don't have the required permissions to view this page.
          If you believe this is a mistake, please contact your
          administrator.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl
              border border-surface-border
              bg-surface-card
              px-4 py-2.5
              text-sm font-semibold
              text-surface-fg
              transition
              hover:border-brand-orange
              hover:text-brand-orange
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl
              bg-brand-orange
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-[0_10px_24px_-8px_rgba(255,90,31,0.55)]
              transition
              hover:opacity-90
            "
          >
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Permission reference */}
        <div className="mt-8 border-t border-surface-border pt-5">
          <p className="text-xs text-surface-muted">
            Permission required
          </p>

          <p className="mt-1 font-mono text-[0.7rem] text-surface-muted">
            ACCESS_DENIED
          </p>
        </div>
      </div>
    </div>
  );
}