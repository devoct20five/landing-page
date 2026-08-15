import {
  Image,
  Video,

  Link2,
  Plus, 
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ExternalLink,
  FolderKanban,
  CalendarDays,
  Upload,
  PlayCircle,
  Filter,
} from "lucide-react";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { projects, clients } from "@/data/mockData";

const behindTheWorkItems = [
  {
    id: "btw-001",
    type: "photo",
    title: "Behind the Scenes — Hero Film",
    description:
      "A few moments from the production and color grading process for the Summer Campaign.",
    projectId: "project-001",
    projectName: "Summer Campaign 2026",
    clientId: "client-001",
    clientName: "Acme Corporation",
    thumbnail:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2 hours ago",
    author: "Rahul Mehta",
  },
  {
    id: "btw-002",
    type: "video",
    title: "Editing Room — Hero Film",
    description:
      "A short look at the team working through the latest cut of the campaign film.",
    projectId: "project-001",
    projectName: "Summer Campaign 2026",
    clientId: "client-001",
    clientName: "Acme Corporation",
    thumbnail:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "Yesterday",
    author: "Priya Nair",
  },
  {
    id: "btw-003",
    type: "youtube",
    title: "Making the Summer Campaign",
    description:
      "A behind-the-scenes film documenting the production of the campaign.",
    projectId: "project-001",
    projectName: "Summer Campaign 2026",
    clientId: "client-001",
    clientName: "Acme Corporation",
    thumbnail:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "published",
    createdAt: "2 days ago",
    author: "Dhruv Kapoor",
  },
  {
    id: "btw-004",
    type: "photo",
    title: "3D Product Development",
    description:
      "Early-stage renders and development work from the Product Launch project.",
    projectId: "project-004",
    projectName: "Product Launch",
    clientId: "client-001",
    clientName: "Acme Corporation",
    thumbnail:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80",
    status: "draft",
    createdAt: "3 days ago",
    author: "Arjun Rao",
  },
  {
    id: "btw-005",
    type: "video",
    title: "Website Design Walkthrough",
    description:
      "A quick walkthrough of the design exploration before development began.",
    projectId: "project-003",
    projectName: "Website Redesign",
    clientId: "client-001",
    clientName: "Acme Corporation",
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "1 week ago",
    author: "Sana Iyer",
  },
  {
    id: "btw-006",
    type: "youtube",
    title: "Product Animation — Process",
    description:
      "The complete creative process behind the latest product animation.",
    projectId: "project-009",
    projectName: "Product Animation",
    clientId: "client-003",
    clientName: "ABC Studios",
    thumbnail:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=80",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "published",
    createdAt: "2 weeks ago",
    author: "Arjun Rao",
  },
];

export default function AdminBehindTheWork() {
  const [items, setItems] = useState(behindTheWorkItems);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.projectName.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "all" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesProject =
        projectFilter === "all" ||
        item.projectId === projectFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesProject
      );
    });
  }, [items, search, typeFilter, statusFilter, projectFilter]);

  const stats = {
    total: items.length,
    published: items.filter((item) => item.status === "published").length,
    drafts: items.filter((item) => item.status === "draft").length,
    videos: items.filter(
      (item) => item.type === "video" || item.type === "youtube"
    ).length,
  };

  function togglePublish(id) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "published"
                  ? "draft"
                  : "published",
            }
          : item
      )
    );
  }

  function deleteItem(id) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  return (
    <div className="min-h-full bg-surface-bg">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
             

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Behind the Work
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Share the creative process, production moments and
                behind-the-scenes content with your clients.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.55)] transition-all hover:brightness-105"
            >
              <Plus className="h-4 w-4" />
              Add Content
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ===================================================
            STATS
        =================================================== */}

        <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-surface-border bg-surface-card sm:grid-cols-4">
          <Stat
            label="Total Content"
            value={stats.total}
            icon={FolderKanban}
          />

          <Stat
            label="Published"
            value={stats.published}
            icon={Eye}
          />

          <Stat
            label="Drafts"
            value={stats.drafts}
            icon={EyeOff}
          />

          <Stat
            label="Video Content"
            value={stats.videos}
            icon={Video}
          />
        </div>

        {/* ===================================================
            FILTER BAR
        =================================================== */}

        <div className="mb-6 rounded-2xl border border-surface-border bg-surface-card p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* Search */}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content..."
                className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg pl-9 pr-4 text-sm text-surface-fg outline-none transition focus:border-brand-orange"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterSelect
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  ["all", "All Types"],
                  ["photo", "Photos"],
                  ["video", "Videos"],
                  ["youtube", "YouTube"],
                ]}
              />

              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  ["all", "All Status"],
                  ["published", "Published"],
                  ["draft", "Drafts"],
                ]}
              />

              <FilterSelect
                value={projectFilter}
                onChange={setProjectFilter}
                options={[
                  ["all", "All Projects"],
                  ...projects.map((project) => [
                    project.id,
                    project.name,
                  ]),
                ]}
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            GRID
        =================================================== */}

        {filteredItems.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <BehindTheWorkCard
                key={item.id}
                item={item}
                onTogglePublish={togglePublish}
                onDelete={deleteItem}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      {showCreate && (
        <CreateContentModal
          onClose={() => setShowCreate(false)}
          onCreate={(newItem) => {
            setItems((current) => [
              {
                ...newItem,
                id: `btw-${Date.now()}`,
                createdAt: "Just now",
                author: "You",
              },
              ...current,
            ]);

            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
   CARD
============================================================ */

function BehindTheWorkCard({
  item,
  onTogglePublish,
  onDelete,
}) {
  const TypeIcon =
    item.type === "photo"
      ? Image
      : item.type === "youtube"
        ? Video
        : Video;

  return (
    <article className="group overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-all duration-200 hover:border-brand-orange/40 hover:shadow-[0_12px_35px_-20px_rgba(0,0,0,0.3)]">
      {/* Thumbnail */}

      <div className="relative aspect-[16/10] overflow-hidden bg-surface-bg">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

        {/* Type */}

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <TypeIcon className="h-3.5 w-3.5" />

          {item.type === "photo"
            ? "Photo"
            : item.type === "youtube"
              ? "YouTube"
              : "Video"}
        </div>

        {/* Status */}

        <div
          className={cn(
            "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            item.status === "published"
              ? "bg-emerald-500 text-white"
              : "bg-white/90 text-surface-fg"
          )}
        >
          {item.status === "published"
            ? "Published"
            : "Draft"}
        </div>

        {/* Play */}

        {(item.type === "video" || item.type === "youtube") && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <PlayCircle className="h-6 w-6 text-brand-orange" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-surface-fg">
              {item.title}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-surface-muted">
              <FolderKanban className="h-3.5 w-3.5" />

              {item.projectName}
            </p>
          </div>

          <button className="shrink-0 rounded-lg p-1.5 text-surface-muted hover:bg-surface-bg hover:text-surface-fg">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <p className="line-clamp-2 text-xs leading-5 text-surface-muted">
          {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Client
            </p>

            <p className="mt-1 text-xs font-semibold text-surface-fg">
              {item.clientName}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Added
            </p>

            <p className="mt-1 text-xs text-surface-muted">
              {item.createdAt}
            </p>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-4 flex items-center gap-2">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-xs font-semibold text-surface-fg hover:border-brand-orange hover:text-brand-orange"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Link
            </a>
          )}

          <button
            onClick={() => onTogglePublish(item.id)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-xs font-semibold text-surface-fg hover:border-brand-orange hover:text-brand-orange"
          >
            {item.status === "published" ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Publish
              </>
            )}
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border text-surface-muted hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   CREATE MODAL
============================================================ */

function CreateContentModal({ onClose, onCreate }) {
  const [type, setType] = useState("photo");

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: projects[0]?.id || "",
    type: "photo",
    thumbnail: "",
    url: "",
    status: "draft",
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submit(e) {
    e.preventDefault();

    const project = projects.find(
      (item) => item.id === form.projectId
    );

    onCreate({
      ...form,
      type,
      projectName: project?.name || "Project",
      clientId: project?.clientId,
      clientName: project?.clientName,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-surface-border bg-surface-card shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-surface-border px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold text-surface-fg">
              Add Behind the Work
            </h2>

            <p className="mt-1 text-xs text-surface-muted">
              Share a new piece of behind-the-scenes content.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-surface-muted hover:bg-surface-bg hover:text-surface-fg"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="space-y-6 p-6">
          {/* Content type */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Content Type
            </label>

            <div className="grid grid-cols-3 gap-2">
              <TypeButton
                active={type === "photo"}
                icon={Image}
                label="Photo"
                onClick={() => setType("photo")}
              />

              <TypeButton
                active={type === "video"}
                icon={Video}
                label="Video"
                onClick={() => setType("video")}
              />

              <TypeButton
                active={type === "youtube"}
                icon={Youtube}
                label="YouTube"
                onClick={() => setType("youtube")}
              />
            </div>
          </div>

          {/* Title */}

          <FormField label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Behind the Scenes — Hero Film"
              className="form-input"
            />
          </FormField>

          {/* Description */}

          <FormField label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                update("description", e.target.value)
              }
              placeholder="Tell the client what's happening behind the work..."
              className="form-input resize-none"
            />
          </FormField>

          {/* Project */}

          <FormField label="Project">
            <select
              value={form.projectId}
              onChange={(e) =>
                update("projectId", e.target.value)
              }
              className="form-input"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} — {project.clientName}
                </option>
              ))}
            </select>
          </FormField>

          {/* Media */}

          {type === "youtube" ? (
            <FormField label="YouTube URL">
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={(e) =>
                    update("url", e.target.value)
                  }
                  placeholder="https://youtube.com/watch?v=..."
                  className="form-input pl-9"
                />
              </div>
            </FormField>
          ) : (
            <div className="rounded-xl border border-dashed border-surface-border bg-surface-bg p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                <Upload className="h-5 w-5 text-brand-orange" />
              </div>

              <p className="mt-3 text-sm font-semibold text-surface-fg">
                Upload {type === "photo" ? "photos" : "video"}
              </p>

              <p className="mt-1 text-xs text-surface-muted">
                Drag and drop files here or browse your computer.
              </p>

              <button
                type="button"
                className="mt-4 rounded-lg border border-surface-border bg-surface-card px-4 py-2 text-xs font-semibold text-surface-fg hover:border-brand-orange hover:text-brand-orange"
              >
                Choose File
              </button>
            </div>
          )}

          {/* Thumbnail */}

          <FormField label="Thumbnail URL">
            <input
              type="url"
              value={form.thumbnail}
              onChange={(e) =>
                update("thumbnail", e.target.value)
              }
              placeholder="Optional thumbnail URL"
              className="form-input"
            />
          </FormField>

          {/* Visibility */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Visibility
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update("status", "draft")}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left",
                  form.status === "draft"
                    ? "border-brand-orange bg-brand-orange/5"
                    : "border-surface-border"
                )}
              >
                <EyeOff className="h-4 w-4 text-surface-muted" />

                <p className="mt-2 text-sm font-semibold text-surface-fg">
                  Draft
                </p>

                <p className="mt-1 text-xs text-surface-muted">
                  Only visible internally.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  update("status", "published")
                }
                className={cn(
                  "rounded-xl border px-4 py-3 text-left",
                  form.status === "published"
                    ? "border-brand-orange bg-brand-orange/5"
                    : "border-surface-border"
                )}
              >
                <Eye className="h-4 w-4 text-brand-orange" />

                <p className="mt-2 text-sm font-semibold text-surface-fg">
                  Published
                </p>

                <p className="mt-1 text-xs text-surface-muted">
                  Visible to the selected client.
                </p>
              </button>
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-surface-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-surface-border px-4 py-2.5 text-sm font-semibold text-surface-fg hover:bg-surface-bg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white"
            >
              Add Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="border-b border-surface-border px-5 py-5 sm:border-b-0 sm:border-r last:border-r-0">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-orange" />

        <span className="text-xs font-medium text-surface-muted">
          {label}
        </span>
      </div>

      <p className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-surface-fg">
        {value}
      </p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-xl border border-surface-border bg-surface-bg px-3 text-xs font-semibold text-surface-fg outline-none focus:border-brand-orange"
    >
      {options.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
        {label}
      </label>

      {children}
    </div>
  );
}

function TypeButton({
  active,
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
        active
          ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
          : "border-surface-border text-surface-muted hover:text-surface-fg"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-bg">
        <Image className="h-5 w-5 text-surface-muted" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-surface-fg">
        No content found
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-surface-muted">
        Try changing your filters or add a new behind-the-scenes
        post.
      </p>
    </div>
  );
}