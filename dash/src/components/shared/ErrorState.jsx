import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

/**
 * Localised error state. Per the UX spec, errors say what failed rather than
 * "Something went wrong", and offer Retry where retrying is safe.
 *
 *   <ErrorState error={error} resource="Projects" onRetry={refetch} />
 */
export default function ErrorState({ error, resource = "This content", onRetry }) {
  const status = error?.status;

  let title = `${resource} couldn't be loaded.`;
  let description = error?.message ?? "Try again in a moment.";
  let canRetry = Boolean(onRetry);

  if (status === 403) {
    title = "You don't have access to this.";
    description = "Ask an admin if you think you should.";
    canRetry = false;
  } else if (status === 404) {
    title = "This no longer exists.";
    description = "It may have been deleted, or you may not have access to it.";
    canRetry = false;
  } else if (status === 0) {
    title = "Couldn't reach the server.";
    description = "Check your connection and try again.";
  }

  return (
    <div
      role="alert"
      className="rounded-card border border-dashed border-surface-border px-6 py-12 text-center"
    >
      <WarningCircle
        className="mx-auto mb-3 h-6 w-6 text-surface-muted"
        weight="bold"
        aria-hidden="true"
      />

      <p className="font-display text-base font-bold text-surface-fg">{title}</p>

      <p className="mx-auto mt-1.5 max-w-sm text-sm text-surface-muted">{description}</p>

      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2 text-sm font-semibold text-surface-fg transition hover:border-brand-orange/40 hover:text-brand-orange"
        >
          <ArrowClockwise className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
