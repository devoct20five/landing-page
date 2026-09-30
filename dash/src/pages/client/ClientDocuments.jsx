import { useCallback, useState } from "react";
import {
  DownloadSimple,
  FileImage,
  FilePdf,
  FileText,
  FileVideo,
  FileXls,
  MagnifyingGlass,
} from "@phosphor-icons/react";

import { filesApi, FileType } from "@/api";
import { useApiResource } from "@/hooks/useApiResource";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SkeletonList } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
  [FileType.PDF]: FilePdf,
  [FileType.IMAGE]: FileImage,
  [FileType.VIDEO]: FileVideo,
  [FileType.SPREADSHEET]: FileXls,
  [FileType.DOC]: FileText,
  [FileType.OTHER]: FileText,
};

const TYPE_FILTERS = [
  { id: "", label: "All" },
  { id: FileType.PDF, label: "PDFs" },
  { id: FileType.IMAGE, label: "Images" },
  { id: FileType.VIDEO, label: "Video" },
  { id: FileType.DOC, label: "Docs" },
];

function formatSize(bytes) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Client-facing file workspace — the /documents route the sidebar already
 * links to. Downloads go through the API layer because the download endpoint
 * is behind the JWT guard and a plain link would arrive unauthenticated.
 */
export default function ClientDocuments() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [fileType, setFileType] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  const fetcher = useCallback(
    () =>
      filesApi.listFiles({
        search: submittedSearch || undefined,
        fileType: fileType || undefined,
        limit: 50,
      }),
    [submittedSearch, fileType],
  );

  const { data, isLoading, error, refetch } = useApiResource(fetcher, [
    submittedSearch,
    fileType,
  ]);

  const files = data?.items ?? [];

  const handleDownload = async (file) => {
    setDownloadingId(file.id);
    setDownloadError(null);
    try {
      await filesApi.downloadFile(file.id, file.name);
    } catch (err) {
      setDownloadError(err?.message ?? "That file couldn't be downloaded.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold tracking-[-0.03em] text-surface-fg">
          Documents
        </h1>
        <p className="mt-1 text-sm text-surface-muted">
          Files shared with you across your projects.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <form
          className="relative min-w-[240px] flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedSearch(search.trim());
          }}
        >
          <MagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search documents"
            aria-label="Search documents"
            className="brand-input w-full pl-9"
          />
        </form>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.id || "all"}
              type="button"
              aria-pressed={fileType === filter.id}
              onClick={() => setFileType(filter.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                fileType === filter.id
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-surface-border text-surface-muted hover:border-brand-orange/40 hover:text-surface-fg",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {downloadError && (
        <p role="alert" className="mb-4 text-sm font-medium text-red-600">
          {downloadError}
        </p>
      )}

      {isLoading && <SkeletonList rows={6} />}

      {!isLoading && error && (
        <ErrorState error={error} resource="Documents" onRetry={refetch} />
      )}

      {!isLoading && !error && files.length === 0 && (
        <EmptyState
          title={
            submittedSearch || fileType
              ? "No documents match those filters."
              : "No documents yet."
          }
          description={
            submittedSearch || fileType
              ? "Try a different search term or clear the type filter."
              : "Files your team shares with you will appear here."
          }
        />
      )}

      {!isLoading && !error && files.length > 0 && (
        <ul className="space-y-2.5">
          {files.map((file) => {
            const Icon = TYPE_ICON[file.fileType] ?? FileText;

            return (
              <li
                key={file.id}
                className="flex items-center gap-4 rounded-card border border-surface-border p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted/10 text-surface-muted">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-surface-fg">
                    {file.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-surface-muted">
                    {[
                      file.project?.name,
                      formatSize(file.sizeBytes),
                      formatDate(file.createdAt ?? file.created_at),
                      file.version ? `v${file.version}` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(file)}
                  disabled={downloadingId === file.id}
                  aria-label={`Download ${file.name}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-surface-border px-3.5 py-2 text-xs font-semibold text-surface-fg transition hover:border-brand-orange/40 hover:text-brand-orange disabled:opacity-50"
                >
                  <DownloadSimple className="h-4 w-4" aria-hidden="true" />
                  {downloadingId === file.id ? "Preparing…" : "Download"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
