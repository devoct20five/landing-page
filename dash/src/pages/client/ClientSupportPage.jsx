import {
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  FolderKanban,
  HelpCircle,
  Mail,
  MessageSquare,
  Plus,
  Receipt,
  Search,
  Star,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ============================================================
   MOCK DATA
============================================================ */

const conversations = [
  {
    id: "sup-041",
    reference: "SUP-2026-0041",
    status: "active",
    subject: "Can't find my August invoice",
    meta: "Updated today · 2 replies",
  },
  {
    id: "sup-038",
    reference: "SUP-2026-0038",
    status: "awaiting_client",
    subject: "How do I download my agreement?",
    meta: "Updated 20 Aug 2026 · 4 replies",
  },
  {
    id: "sup-031",
    reference: "SUP-2026-0031",
    status: "active",
    subject: "How do tokens work?",
    meta: "Updated 19 Aug 2026 · 3 replies",
  },
  {
    id: "sup-025",
    reference: "SUP-2026-0025",
    status: "resolved",
    subject: "Where can I update my account information?",
    meta: "Resolved 13 Aug 2026 · 2 replies",
  },
  {
    id: "sup-018",
    reference: "SUP-2026-0018",
    status: "resolved",
    subject: "How do I add a meeting to my calendar?",
    meta: "Resolved 05 Aug 2026 · 3 replies",
  },
];

const faqCategories = [
  { id: "account", label: "Account & Workspace", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "invoices", label: "Invoices & Payments", icon: Receipt },
  { id: "tokens", label: "Tokens", icon: Coins },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "general", label: "General", icon: HelpCircle },
];

/* ============================================================
   PAGE
============================================================ */

export default function ClientSupport() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [faqSearch, setFaqSearch] = useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term || c.subject.toLowerCase().includes(term) || c.reference.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const filteredFaqs = useMemo(() => {
    const term = faqSearch.toLowerCase().trim();
    if (!term) return faqCategories;
    return faqCategories.filter((f) => f.label.toLowerCase().includes(term));
  }, [faqSearch]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-bold tracking-[-0.01em] text-slate-900">
            Support &amp; Help
          </h1>
          <p className="mt-1.5 text-[13px] text-slate-500">
            Need help using your OCT2OFIVE workspace? We&rsquo;re here to help.
          </p>
        </div>

        {/* Quick actions */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <QuickAction
            icon={Mail}
            title="Contact Us"
            description="Email the OCT2OFIVE support team."
          />
          <QuickAction
            icon={Plus}
            title="Raise a Ticket"
            description="Create a support request and track it."
          />
        </div>

        {/* Two-pane layout */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Conversations */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-[15px] font-semibold text-slate-900">Your Conversations</h2>

            <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-300"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-medium text-slate-600 outline-none focus:border-rose-300"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="awaiting_client">Awaiting Your Response</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((c) => <ConversationRow key={c.id} conversation={c} />)
              ) : (
                <div className="py-14 text-center text-[13px] text-slate-400">
                  No conversations match the selected filters.
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[12px] text-slate-400">1–5 of 12 conversations</span>
              <div className="flex items-center gap-1">
                <button className="grid h-7 w-7 place-items-center rounded-md text-slate-300">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-md text-[12px] font-semibold",
                      n === 1 ? "bg-rose-50 text-rose-600" : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {n}
                  </button>
                ))}
                <button className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-[15px] font-semibold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-1 text-[12.5px] text-slate-500">
              Quick answers to common questions about using your OCT2OFIVE workspace.
            </p>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-300"
              />
            </div>

            <div className="mt-3 space-y-1">
              {filteredFaqs.map((f) => (
                <FaqRow key={f.id} category={f} />
              ))}
            </div>
          </section>
        </div>

        {/* Help footer */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-4 w-4 text-rose-500" />
            <div>
              <p className="text-[13px] font-semibold text-slate-900">Help us improve</p>
              <p className="text-[12.5px] text-slate-500">
                Have feedback about the Client Portal? We&rsquo;d love to hear it.
              </p>
            </div>
          </div>
          <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 px-3.5 py-2 text-[12.5px] font-semibold text-rose-600 hover:bg-rose-50">
            Give Feedback
            <ArrowUpRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   QUICK ACTION CARD
============================================================ */

function QuickAction({ icon: Icon, title, description }) {
  return (
    <button className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left hover:border-slate-300">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-50">
        <Icon className="h-5 w-5 text-rose-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-slate-900">{title}</p>
        <p className="text-[12.5px] text-slate-500">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-rose-500" />
    </button>
  );
}

/* ============================================================
   CONVERSATION ROW
============================================================ */

function getStatusConfig(status) {
  const config = {
    active: { label: "Active", tint: "text-orange-500", bg: "bg-orange-50", icon: Mail },
    awaiting_client: {
      label: "Awaiting Your Response",
      tint: "text-sky-600",
      bg: "bg-sky-50",
      icon: MessageSquare,
    },
    resolved: {
      label: "Resolved",
      tint: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle2,
    },
  };
  return config[status] || config.active;
}

function ConversationRow({ conversation }) {
  const status = getStatusConfig(conversation.status);
  const Icon = status.icon;

  return (
    <button className="group flex w-full items-start gap-3 py-3.5 text-left">
      <div className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", status.bg)}>
        <Icon className={cn("h-4 w-4", status.tint)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">{conversation.reference}</span>
          <span className={cn("text-[11px] font-semibold", status.tint)}>{status.label}</span>
        </div>
        <p className="mt-1 text-[13.5px] font-semibold leading-snug text-slate-900">
          {conversation.subject}
        </p>
        <p className="text-[11px] text-slate-400">{conversation.meta}</p>
      </div>
      <ChevronRight className="mt-1 hidden h-4 w-4 shrink-0 text-slate-300 group-hover:text-rose-500 sm:block" />
    </button>
  );
}

/* ============================================================
   FAQ ROW
============================================================ */

function FaqRow({ category }) {
  const Icon = category.icon;
  return (
    <button className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-slate-50">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-[13px] font-medium text-slate-800">{category.label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-rose-500" />
    </button>
  );
}

/* ============================================================
   ICON
============================================================ */

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
