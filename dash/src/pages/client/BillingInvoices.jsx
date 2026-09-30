import { useMemo, useState } from "react";
import { Search, Calendar, ChevronDown, Download } from "lucide-react";

/* ============================================================
   MOCK DATA
============================================================ */

const invoices = [
  {
    id: "INV-2026-0092",
    date: "Sep 02, 2026",
    month: "September 2026",
    details: "Editing · Standard · 3 Projects",
    amount: "₹1,18,000",
    status: "Paid",
  },
  {
    id: "INV-2026-0089",
    date: "Sep 01, 2026",
    month: "September 2026",
    details: "3D & CGI · Advanced · 3 Projects",
    amount: "₹1,42,000",
    status: "Paid",
  },
  {
    id: "INV-2026-0071",
    date: "Aug 18, 2026",
    month: "August 2026",
    details: "Web Development · Standard · 1 Project",
    amount: "₹64,500",
    status: "Paid",
  },
  {
    id: "INV-2026-0058",
    date: "Aug 03, 2026",
    month: "August 2026",
    details: "Editing · Standard · 2 Projects",
    amount: "₹92,000",
    status: "Pending",
  },
];

const MONTHS = ["All Invoices", "September 2026", "August 2026"];

const STATUS_STYLES = {
  Paid: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-rose-50 text-rose-600",
};

/* ============================================================
   PAGE
============================================================ */

export default function BillingInvoices() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("September 2026");
  const [monthOpen, setMonthOpen] = useState(false);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesMonth = month === "All Invoices" || inv.month === month;
      const term = search.toLowerCase().trim();
      const matchesSearch = !term || inv.id.toLowerCase().includes(term);
      return matchesMonth && matchesSearch;
    });
  }, [search, month]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-bold tracking-[-0.01em] text-slate-900">
            Billing &amp; Invoices
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">View and download your invoices.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-[15px] font-semibold text-slate-900">Invoices</h2>

          {/* Filter bar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice ID..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-300"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setMonthOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[12.5px] font-medium text-slate-700"
              >
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {month}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
              {monthOpen && (
                <div className="absolute right-0 z-10 mt-1.5 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMonth(m);
                        setMonthOpen(false);
                      }}
                      className={`block w-full px-3.5 py-2 text-left text-[12.5px] hover:bg-slate-50 ${
                        m === month ? "font-semibold text-rose-600" : "text-slate-700"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Invoice ID", "Date", "Purchase Details", "Amount", "Status", "Action"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={
                          "whitespace-nowrap pb-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 " +
                          (i === 3 || i === 4 || i === 5 ? "text-left sm:text-left" : "text-left")
                        }
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-50 last:border-b-0">
                      <td className="whitespace-nowrap py-4 pr-4 text-[13px] font-semibold text-slate-900">
                        {inv.id}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-[13px] text-slate-600">
                        {inv.date}
                      </td>
                      <td className="py-4 pr-4 text-[13px] text-slate-600">{inv.details}</td>
                      <td className="whitespace-nowrap py-4 pr-4 text-[13px] font-semibold text-slate-900">
                        {inv.amount}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            STATUS_STYLES[inv.status] || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-4">
                        <button
                          title="Download invoice"
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-rose-600"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-[13px] text-slate-400">
                      No invoices match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <p className="mt-4 border-t border-slate-100 pt-4 text-[12px] text-slate-400">
            {filtered.length > 0
              ? `Showing 1 to ${filtered.length} of ${filtered.length} invoice${
                  filtered.length !== 1 ? "s" : ""
                }`
              : "Showing 0 invoices"}
          </p>
        </div>
      </div>
    </div>
  );
}
