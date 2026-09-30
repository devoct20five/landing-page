import { useState } from "react";
import { User, Globe, Clock, Info, Lock, ChevronDown } from "lucide-react";

/* ============================================================
   SMALL PIECES
============================================================ */

function SectionHeader({ icon: Icon, iconBg, iconColor, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${iconBg}`}>
        <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-[13px] font-bold tracking-wide text-slate-900">{title}</h2>
        <p className="mt-0.5 text-[12.5px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function FieldRow({ label, required, help, children }) {
  return (
    <div className="grid gap-1.5 py-3 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-6">
      <div>
        <label className="text-[13px] font-semibold text-slate-800">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
        {help && <p className="mt-0.5 text-[11.5px] text-slate-400">{help}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-rose-300"
    />
  );
}

function NoticeBox({ tone = "blue", icon: Icon = Info, children }) {
  const tones = {
    blue: "bg-sky-50 text-sky-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div
      className={`mt-4 flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-[12px] leading-5 ${tones[tone]}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AccountSettings() {
  const [name, setName] = useState("Manik");
  const [email, setEmail] = useState("manik@example.com");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("Acme Studios Pvt. Ltd.");
  const [gstNumber, setGstNumber] = useState("27ABCDE1234F1Z5");
  const [timezone, setTimezone] = useState("ist");

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-[720px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-bold tracking-[-0.01em] text-slate-900">
            Account Settings
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white">
          {/* PROFILE */}
          <div className="p-6">
            <SectionHeader
              icon={User}
              iconBg="bg-violet-100"
              iconColor="text-violet-600"
              title="PROFILE"
              description="Your personal account information."
            />

            <div className="mt-4 divide-y divide-slate-100">
              <FieldRow label="Name" required>
                <TextInput value={name} onChange={(e) => setName(e.target.value)} />
              </FieldRow>
              <FieldRow label="Email" required>
                <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FieldRow>
              <FieldRow label="Phone" help="Optional">
                <div className="flex gap-2">
                  <div className="flex w-24 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 text-[13px] text-slate-700">
                    <span>🇮🇳</span>
                    <span>+91</span>
                    <ChevronDown className="ml-auto h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="XXXXX XXXXX"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-rose-300"
                  />
                </div>
              </FieldRow>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* BUSINESS & REGIONAL */}
          <div className="p-6">
            <SectionHeader
              icon={Globe}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="BUSINESS & REGIONAL INFORMATION"
              description="Your business details and regional preferences for billing."
            />

            <div className="mt-4 divide-y divide-slate-100">
              <FieldRow
                label="Country / Region"
                required
                help="This will determine your billing region and currency."
              >
                <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-[13px] text-slate-800">
                  <span className="flex items-center gap-2">
                    <span>🇮🇳</span> India
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </FieldRow>

              <FieldRow label="Currency" help="Preferred based on your country.">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-500">
                  <span>INR (₹)</span>
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </FieldRow>

              <FieldRow label="Company Name" help="Optional">
                <TextInput value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </FieldRow>

              <FieldRow label="GST Number" help="Optional - Available for Domestic accounts">
                <TextInput value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
              </FieldRow>
            </div>

            <NoticeBox tone="green">
              GST Number is required only for Domestic (India) accounts. It will be used to generate
              accurate invoices.
            </NoticeBox>

            <NoticeBox tone="blue">
              Country can be changed at the end of the fiscal year. Need to change it earlier?{" "}
              <span className="font-semibold underline underline-offset-2">Contact us.</span>
            </NoticeBox>
          </div>

          <div className="border-t border-slate-100" />

          {/* TIMEZONE */}
          <div className="p-6">
            <SectionHeader
              icon={Clock}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
              title="TIMEZONE"
              description="Set your timezone for all time-based information."
            />

            <div className="mt-4">
              <FieldRow label="Timezone" required>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 outline-none focus:border-rose-300"
                >
                  <option value="ist">India Standard Time (IST) (UTC +05:30)</option>
                  <option value="est">Eastern Time (ET) (UTC -05:00)</option>
                  <option value="gmt">Greenwich Mean Time (GMT) (UTC +00:00)</option>
                  <option value="pst">Pacific Time (PT) (UTC -08:00)</option>
                </select>
              </FieldRow>
            </div>

            <NoticeBox tone="blue">
              This timezone will be used for projects, meetings, tasks and notifications across the
              Client OS.
            </NoticeBox>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2.5">
          <button className="rounded-lg bg-rose-600 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-rose-700">
            Save Changes
          </button>
          <button className="rounded-lg border border-slate-200 px-5 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
