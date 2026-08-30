import { useMemo, useState } from "react";
import {
  Upload,
  FolderPlus,
  Search,
  Grid2X2,
  List,
  MoreHorizontal,
  FileText,
  Image,
  Film,
  FileSpreadsheet,
  File,
  Folder,
  ChevronRight,
  Download,
  Trash2,
  Pencil,
  Move,
  Check,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

const MOCK_FILES = [
  {
    id: 1,
    name: "Brand Guidelines.pdf",
    type: "pdf",
    size: "4.8 MB",
    modified: "Aug 15, 2026",
    folder: "Brand",
    project: "Acme Website",
    shared: true,
  },
  {
    id: 2,
    name: "Homepage Final.png",
    type: "image",
    size: "2.4 MB",
    modified: "Aug 14, 2026",
    folder: "Website",
    project: "Acme Website",
    shared: true,
  },
  {
    id: 3,
    name: "Campaign Final.mp4",
    type: "video",
    size: "86.2 MB",
    modified: "Aug 13, 2026",
    folder: "Campaigns",
    project: "Nike Campaign",
    shared: false,
  },
  {
    id: 4,
    name: "Client List.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    modified: "Aug 12, 2026",
    folder: "Documents",
    project: "Acme Website",
    shared: true,
  },
  {
    id: 5,
    name: "Social Media Copy.pdf",
    type: "pdf",
    size: "3.1 MB",
    modified: "Aug 11, 2026",
    folder: "Documents",
    project: "Nike Campaign",
    shared: false,
  },
  {
    id: 6,
    name: "Logo Pack.zip",
    type: "file",
    size: "18.5 MB",
    modified: "Aug 10, 2026",
    folder: "Brand",
    project: "Acme Website",
    shared: true,
  },
];

const FOLDERS = [
  { id: "all", name: "All Files", count: 42 },
  { id: "shared", name: "Shared With Me", count: 14 },
  { id: "images", name: "Images", count: 16 },
  { id: "documents", name: "Documents", count: 12 },
  { id: "videos", name: "Videos", count: 8 },
  { id: "brand", name: "Brand", count: 6 },
];

function FileIcon({ type }) {
  if (type === "image") {
    return <Image className="h-10 w-10" />;
  }

  if (type === "video") {
    return <Film className="h-10 w-10" />;
  }

  if (type === "spreadsheet") {
    return <FileSpreadsheet className="h-10 w-10" />;
  }

  if (type === "pdf") {
    return <FileText className="h-10 w-10" />;
  }

  return <File className="h-10 w-10" />;
}

export default function StaffFiles() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const filteredFiles = useMemo(() => {
    return MOCK_FILES.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      if (selectedFolder === "all") {
        return true;
      }

      if (selectedFolder === "shared") {
        return file.shared;
      }

      if (selectedFolder === "images") {
        return file.type === "image";
      }

      if (selectedFolder === "videos") {
        return file.type === "video";
      }

      if (selectedFolder === "documents") {
        return ["pdf", "spreadsheet"].includes(file.type);
      }

      return file.folder.toLowerCase() === selectedFolder;
    });
  }, [search, selectedFolder]);

  const toggleSelection = (id) => {
    setSelectedFiles((current) =>
      current.includes(id) ? current.filter((fileId) => fileId !== id) : [...current, id]
    );
  };

  const handleUpload = () => {
    console.log("Upload staff files");
  };

  const handleNewFolder = () => {
    console.log("Create staff folder");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-fg">Files</h1>

          <p className="mt-1 text-sm text-surface-muted">
            Manage files and assets for your projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewFolder}
            className="inline-flex items-center gap-2 rounded-lg border border-surface-border px-4 py-2 text-sm font-semibold text-surface-fg transition hover:bg-surface-muted/10"
          >
            <FolderPlus size={16} />
            New Folder
          </button>

          <button
            type="button"
            onClick={handleUpload}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Upload size={16} />
            Upload Files
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-muted">
        <span className="font-medium text-surface-fg">Files</span>

        {selectedFolder !== "all" && (
          <>
            <ChevronRight size={14} />

            <span className="font-medium text-surface-fg">
              {FOLDERS.find((folder) => folder.id === selectedFolder)?.name}
            </span>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="brand-card h-fit p-2">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-surface-muted">
            Library
          </div>

          <div className="space-y-1">
            {FOLDERS.map((folder) => {
              const active = selectedFolder === folder.id;

              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolder(folder.id)}
                  className={[
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition",
                    active
                      ? "bg-brand-orange/10 font-semibold text-brand-orange"
                      : "text-surface-muted hover:bg-surface-muted/10 hover:text-surface-fg",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    {folder.id === "shared" ? (
                      <Users size={15} />
                    ) : folder.id === "all" ? (
                      <File size={15} />
                    ) : (
                      <Folder size={15} />
                    )}

                    {folder.name}
                  </span>

                  <span className="text-xs">{folder.count}</span>
                </button>
              );
            })}
          </div>

          {/* Projects */}
          <div className="mt-5 border-t border-surface-border pt-4">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-surface-muted">
              Projects
            </div>

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
            >
              <BriefcaseBusiness size={15} />
              Acme Website
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
            >
              <BriefcaseBusiness size={15} />
              Nike Campaign
            </button>
          </div>

          {/* Storage */}
          <div className="mt-5 border-t border-surface-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-surface-muted">My Storage</span>

              <span className="text-xs font-semibold text-surface-fg">2.8 GB / 10 GB</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted/20">
              <div className="h-full w-[28%] rounded-full bg-brand-orange" />
            </div>

            <p className="mt-2 text-[11px] text-surface-muted">7.2 GB remaining</p>
          </div>
        </aside>

        {/* Main Library */}
        <main className="min-w-0">
          {/* Toolbar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search files..."
                className="h-10 w-full rounded-lg border border-surface-border bg-transparent pl-9 pr-3 text-sm outline-none transition focus:border-brand-orange"
              />
            </div>

            <div className="flex items-center gap-2">
              {selectedFiles.length > 0 && (
                <span className="mr-2 text-xs font-medium text-surface-muted">
                  {selectedFiles.length} selected
                </span>
              )}

              <select className="h-10 rounded-lg border border-surface-border bg-transparent px-3 text-sm text-surface-fg outline-none">
                <option>Recently Modified</option>
                <option>Name</option>
                <option>Size</option>
                <option>Type</option>
              </select>

              <div className="flex rounded-lg border border-surface-border p-1">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={[
                    "rounded p-1.5",
                    view === "grid" ? "bg-surface-muted/10 text-surface-fg" : "text-surface-muted",
                  ].join(" ")}
                >
                  <Grid2X2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={[
                    "rounded p-1.5",
                    view === "list" ? "bg-surface-muted/10 text-surface-fg" : "text-surface-muted",
                  ].join(" ")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-surface-border bg-surface-muted/5 p-2">
              <span className="mr-auto px-2 text-xs font-semibold text-surface-fg">
                {selectedFiles.length} files selected
              </span>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-surface-muted hover:bg-surface-muted/10 hover:text-surface-fg"
              >
                <Download size={13} />
                Download
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-surface-muted hover:bg-surface-muted/10 hover:text-surface-fg"
              >
                <Move size={13} />
                Move
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          )}

          {/* Grid */}
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => {
                const selected = selectedFiles.includes(file.id);

                return (
                  <div
                    key={file.id}
                    className={[
                      "group relative overflow-hidden rounded-xl border bg-surface-card transition",
                      selected
                        ? "border-brand-orange ring-1 ring-brand-orange"
                        : "border-surface-border hover:border-brand-orange/40",
                    ].join(" ")}
                  >
                    {/* Preview */}
                    <button
                      type="button"
                      onClick={() => toggleSelection(file.id)}
                      className="flex h-36 w-full items-center justify-center bg-surface-muted/5 text-surface-muted"
                    >
                      <FileIcon type={file.type} />
                    </button>

                    {/* Selection */}
                    <button
                      type="button"
                      onClick={() => toggleSelection(file.id)}
                      className={[
                        "absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded border",
                        selected
                          ? "border-brand-orange bg-brand-orange text-white"
                          : "border-surface-border bg-surface-card opacity-0 group-hover:opacity-100",
                      ].join(" ")}
                    >
                      {selected && <Check size={12} />}
                    </button>

                    {/* Menu */}
                    <button
                      type="button"
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-surface-card text-surface-muted shadow-sm opacity-0 transition group-hover:opacity-100"
                    >
                      <MoreHorizontal size={15} />
                    </button>

                    {/* Info */}
                    <div className="border-t border-surface-border p-3">
                      <p className="truncate text-sm font-semibold text-surface-fg">{file.name}</p>

                      <p className="mt-1 truncate text-[11px] text-surface-muted">{file.project}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-surface-muted">{file.size}</span>

                        {file.shared && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-orange">
                            <Users size={11} />
                            Shared
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List */
            <div className="brand-card overflow-hidden">
              {filteredFiles.map((file) => {
                const selected = selectedFiles.includes(file.id);

                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 border-b border-surface-border px-4 py-3 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSelection(file.id)}
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                        selected
                          ? "border-brand-orange bg-brand-orange text-white"
                          : "border-surface-border",
                      ].join(" ")}
                    >
                      {selected && <Check size={12} />}
                    </button>

                    <FileIcon type={file.type} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-surface-fg">{file.name}</p>

                      <p className="truncate text-xs text-surface-muted">
                        {file.project} · {file.folder}
                      </p>
                    </div>

                    <span className="hidden text-xs text-surface-muted sm:block">{file.size}</span>

                    <span className="hidden text-xs text-surface-muted md:block">
                      {file.modified}
                    </span>

                    {file.shared && (
                      <Users size={14} className="hidden text-brand-orange sm:block" />
                    )}

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-surface-muted hover:bg-surface-muted/10"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty */}
          {filteredFiles.length === 0 && (
            <div className="brand-card flex min-h-64 items-center justify-center">
              <div className="text-center">
                <File className="mx-auto h-10 w-10 text-surface-muted" />

                <p className="mt-3 text-sm font-semibold text-surface-fg">No files found</p>

                <p className="mt-1 text-xs text-surface-muted">
                  Try changing your search or folder.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
