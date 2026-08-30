import { useState } from "react";
import { User, Building2, Bell, Lock, Mail, ShieldCheck, Save } from "lucide-react";

import { currentClient } from "@/data/mockData";
import { cn } from "@/lib/utils";

const SETTINGS_SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    description: "Your personal information",
    icon: User,
  },
  {
    id: "company",
    label: "Company",
    description: "Your company details",
    icon: Building2,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Choose what you hear about",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and account security",
    icon: Lock,
  },
];

function SectionButton({ section, active, onClick }) {
  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all",
        active
          ? "bg-brand-orange text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)]"
          : "text-surface-muted hover:bg-surface-muted/10 hover:text-surface-fg"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />

      <div className="min-w-0">
        <p className="text-sm font-semibold">{section.label}</p>

        <p
          className={cn(
            "mt-0.5 truncate text-[0.68rem]",
            active ? "text-white/75" : "text-surface-muted"
          )}
        >
          {section.description}
        </p>
      </div>
    </button>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled = false }) {
  return (
    <div>
      <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("brand-input w-full", disabled && "cursor-not-allowed opacity-60")}
      />
    </div>
  );
}

function SaveButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)] transition hover:brightness-105"
    >
      <Save className="h-4 w-4" />
      Save Changes
    </button>
  );
}

function ProfileSettings() {
  const client = currentClient || {};

  const [form, setForm] = useState({
    firstName: client.firstName || "",
    lastName: client.lastName || "",
    email: client.email || "",
    phone: client.phone || "",
    role: client.role || "",
  });

  const update = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-surface-fg">Profile</h2>

        <p className="mt-1 text-sm text-surface-muted">
          Manage the personal information associated with your client account.
        </p>
      </div>

      <div className="brand-card">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 font-display text-lg font-bold text-brand-orange">
            {client.initials || "CL"}
          </div>

          <div>
            <p className="font-semibold text-surface-fg">{client.name || "Client"}</p>

            <p className="text-sm text-surface-muted">Client account</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First Name" value={form.firstName} onChange={update("firstName")} />

          <Field label="Last Name" value={form.lastName} onChange={update("lastName")} />

          <Field label="Email Address" type="email" value={form.email} onChange={update("email")} />

          <Field label="Phone" value={form.phone} onChange={update("phone")} />

          <Field label="Role" value={form.role} onChange={update("role")} />
        </div>

        <div className="mt-7 flex justify-end border-t border-surface-border pt-5">
          <SaveButton />
        </div>
      </div>
    </div>
  );
}

function CompanySettings() {
  const client = currentClient || {};

  const [form, setForm] = useState({
    companyName: client.name || "",
    shortName: client.shortName || "",
    email: client.email || "",
    phone: client.phone || "",
    website: client.website || "",
  });

  const update = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-surface-fg">Company</h2>

        <p className="mt-1 text-sm text-surface-muted">
          Manage the company information visible to OCT20FIVE.
        </p>
      </div>

      <div className="brand-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-display font-bold text-surface-fg">Company Information</h3>

            <p className="text-xs text-surface-muted">Basic information about your organisation</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company Name" value={form.companyName} onChange={update("companyName")} />

          <Field label="Short Name" value={form.shortName} onChange={update("shortName")} />

          <Field label="Company Email" type="email" value={form.email} onChange={update("email")} />

          <Field label="Phone" value={form.phone} onChange={update("phone")} />

          <Field
            label="Website"
            value={form.website}
            onChange={update("website")}
            placeholder="https://example.com"
          />
        </div>

        <div className="mt-7 flex justify-end border-t border-surface-border pt-5">
          <SaveButton />
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    taskUpdates: true,
    approvals: true,
    messages: true,
    deadlines: true,
    weeklySummary: false,
  });

  const toggle = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const options = [
    {
      key: "projectUpdates",
      title: "Project updates",
      description: "Receive updates when the status or progress of a project changes.",
    },
    {
      key: "taskUpdates",
      title: "Task updates",
      description: "Get notified about important task changes.",
    },
    {
      key: "approvals",
      title: "Approvals",
      description: "Receive notifications when something requires your approval.",
    },
    {
      key: "messages",
      title: "Messages",
      description: "Get notified when the OCT20FIVE team sends you a message.",
    },
    {
      key: "deadlines",
      title: "Deadline reminders",
      description: "Receive reminders about upcoming project deadlines.",
    },
    {
      key: "weeklySummary",
      title: "Weekly summary",
      description: "Receive a weekly overview of your active projects.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-surface-fg">Notifications</h2>

        <p className="mt-1 text-sm text-surface-muted">Choose which updates you want to receive.</p>
      </div>

      <div className="brand-card divide-y divide-surface-border p-0">
        {options.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-surface-fg">{option.title}</p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-surface-muted">
                {option.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggle(option.key)}
              aria-pressed={notifications[option.key]}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition",
                notifications[option.key] ? "bg-brand-orange" : "bg-surface-border"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                  notifications[option.key] ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const update = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-surface-fg">Security</h2>

        <p className="mt-1 text-sm text-surface-muted">
          Keep your account secure and manage your password.
        </p>
      </div>

      <div className="brand-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-display font-bold text-surface-fg">Change Password</h3>

            <p className="text-xs text-surface-muted">
              Use a strong password you don't use elsewhere.
            </p>
          </div>
        </div>

        <div className="max-w-xl space-y-5">
          <Field
            label="Current Password"
            type="password"
            value={form.currentPassword}
            onChange={update("currentPassword")}
          />

          <Field
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={update("newPassword")}
          />

          <Field
            label="Confirm New Password"
            type="password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
          />
        </div>

        <div className="mt-7 flex justify-end border-t border-surface-border pt-5">
          <SaveButton />
        </div>
      </div>

      <div className="brand-card">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-surface-muted" />

          <div>
            <h3 className="font-display font-bold text-surface-fg">Account Email</h3>

            <p className="mt-1 text-sm text-surface-muted">
              Your account email is used for login and important account notifications.
            </p>

            <p className="mt-3 text-sm font-semibold text-surface-fg">
              {currentClient?.email || "No email configured"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientSettings() {
  const [activeSection, setActiveSection] = useState("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "company":
        return <CompanySettings />;

      case "notifications":
        return <NotificationSettings />;

      case "security":
        return <SecuritySettings />;

      case "profile":
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
          Settings
        </h1>

        <p className="mt-2 text-lead text-surface-muted">
          Manage your account, company information, notifications, and security.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Settings navigation */}
        <aside>
          <div className="brand-card p-2">
            <nav className="space-y-1">
              {SETTINGS_SECTIONS.map((section) => (
                <SectionButton
                  key={section.id}
                  section={section}
                  active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Settings content */}
        <section className="min-w-0">{renderSection()}</section>
      </div>
    </div>
  );
}
