"use client";

import { useState, useMemo, useEffect } from "react";
import { submitLead } from "@/lib/submitLead";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  CalendarClock,
  Calendar,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Mail,
  ArrowUpRight,
  User,
  Briefcase,
  Building2,
  MoreHorizontal,
  Scissors,
  PenTool,
  Box,
  LayoutGrid,
  CircleHelp,
  Target,
  ShieldCheck,
  Video,
  Info,
  Lock,
  Pencil,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";

const REACHING = [
  { label: "Individual / Creator", icon: User },
  { label: "Brand / Business", icon: Briefcase },
  { label: "Agency / Studio", icon: Building2 },
  { label: "Other", icon: MoreHorizontal },
];

const NEEDS = [
  { label: "Editing", icon: Scissors },
  { label: "Design", icon: PenTool },
  { label: "3D Ads", icon: Box },
  { label: "Web Dev", icon: Globe },
  { label: "Multiple Services", icon: LayoutGrid },
  { label: "Not Sure Yet", icon: CircleHelp },
];

const TIMES = [
  "10:00 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "04:30 PM",
  "06:00 PM",
  "07:30 PM",
];

function buildMonth(base) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  // Leading days from previous month (greyed, disabled)
  for (let i = startDay; i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  // This month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  // Trailing days to complete the last row
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      inMonth: false,
    });
  }
  return { year, month, cells };
}

const SERVICE_LABEL = { editing: "Editing", design: "Design", "3d-ads": "3D Ads", "web-dev": "Web Dev" };

export default function BookACallPage() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    role: "Individual / Creator",
    name: "",
    email: "",
    needs: [],
    project: "",
    date: null,
    time: null,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [monthCursor, setMonthCursor] = useState(new Date());
  const monthData = useMemo(() => buildMonth(monthCursor), [monthCursor]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const setField = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const toggleNeed = (n) =>
    setState((s) => ({
      ...s,
      needs: s.needs.includes(n)
        ? s.needs.filter((x) => x !== n)
        : [...s.needs, n],
    }));

  // ?service=editing&plan=advance (from a pricing CTA) pre-selects the need
  useEffect(() => {
    const svc = new URLSearchParams(window.location.search).get("service");
    const label = SERVICE_LABEL[svc];
    if (label) setState((x) => (x.needs.includes(label) ? x : { ...x, needs: [label] }));
  }, []);

  const canConfirm =
    state.name && state.email && state.role && state.needs.length > 0 && !sending;

  const monthLabel = monthCursor
    .toLocaleString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();

  const nextMonth = () =>
    setMonthCursor(
      new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1),
    );
  const prevMonth = () =>
    setMonthCursor(
      new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1),
    );

  const dateLabel = state.date
    ? state.date
        .toLocaleDateString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        .toUpperCase()
    : null;

  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-20">
          <div className="container">
            <AnimatePresence mode="wait">
              {!confirmed && step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <StepHeader step={1} />
                  <div className="grid lg:grid-cols-12 gap-10 mt-10">
                    <div className="lg:col-span-4">
                      <SectionTag>Book a call</SectionTag>
                      <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                        Let&rsquo;s find a{" "}
                        <span className="text-brand-orange">time that</span>{" "}
                        works for you.
                      </h1>
                      <p className="mt-6 text-body-lg opacity-70 max-w-md">
                        Pick a date and time that works best for you. The call
                        is 20 minutes on Google Meet.
                      </p>

                      <div className="mt-10 space-y-3">
                        <InfoRow
                          icon={Clock}
                          title="20 min call"
                          desc="Focused. No pressure."
                        />
                        <InfoRow
                          icon={Video}
                          title="Google Meet"
                          desc="Online. Easy to join."
                        />
                        <InfoRow
                          icon={ShieldCheck}
                          title="No commitment"
                          desc="Just a conversation."
                        />
                      </div>

                      <p className="mt-10 text-sm opacity-60">
                        Questions? Contact us at{" "}
                        <a
                          href="mailto:hello@oct20five.com"
                          className="text-brand-orange underline underline-offset-4"
                        >
                          hello@oct20five.com
                        </a>
                      </p>
                    </div>

                    <div className="lg:col-span-8">
                      <div className="brand-card !p-6 md:!p-8 space-y-8">
                        <div className="flex items-center justify-between gap-4">
                          <p className="eyebrow">
                            <span className="eyebrow-dot" /> 1. Choose a date
                          </p>
                          <div className="relative">
                            <label className="sr-only" htmlFor="tz">
                              Your time zone
                            </label>
                            <p className="text-[11px] uppercase opacity-50 mb-1 text-right">
                              Your time zone
                            </p>
                            <div
                              className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                              style={{ borderColor: "var(--surface-border)" }}
                            >
                              <Globe size={14} className="text-brand-orange" />
                              <span>India — IST (GMT+5:30)</span>
                              <ChevronDown size={14} className="opacity-60" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-2xl uppercase tracking-tight">
                              {monthLabel}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={prevMonth}
                                className="btn-icon !w-9 !h-9"
                                aria-label="Previous month"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <button
                                onClick={nextMonth}
                                className="btn-icon !w-9 !h-9"
                                aria-label="Next month"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-xs opacity-50 mb-2">
                            {[
                              "SUN",
                              "MON",
                              "TUE",
                              "WED",
                              "THU",
                              "FRI",
                              "SAT",
                            ].map((d) => (
                              <div key={d}>{d}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {monthData.cells.map(({ date: d, inMonth }, i) => {
                              const isPast = d < today;
                              const disabled = isPast || !inMonth;
                              const isSelected =
                                state.date &&
                                d.toDateString() === state.date.toDateString();
                              return (
                                <button
                                  key={i}
                                  disabled={disabled}
                                  onClick={() => setField("date", d)}
                                  className={`aspect-square rounded-full text-sm font-medium transition-all
                                    ${!inMonth ? "opacity-20 cursor-not-allowed" : isPast ? "opacity-30 cursor-not-allowed" : "hover:bg-brand-orange/10 hover:text-brand-orange"}
                                    ${isSelected ? "bg-brand-orange text-brand-cream hover:!bg-brand-orange hover:!text-brand-cream" : ""}
                                  `}
                                >
                                  {d.getDate()}
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-4 text-xs opacity-60 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Available dates
                          </p>
                        </div>

                        <div>
                          <p className="eyebrow">
                            <span className="eyebrow-dot" /> 2. Choose a time
                          </p>
                          <p className="mt-2 text-xs opacity-60">
                            All times are shown in India Standard Time (IST)
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {TIMES.map((t) => (
                              <button
                                key={t}
                                disabled={!state.date}
                                onClick={() => setField("time", t)}
                                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                                  !state.date
                                    ? "opacity-30 cursor-not-allowed"
                                    : "hover:border-brand-orange hover:text-brand-orange"
                                } ${
                                  state.time === t
                                    ? "bg-brand-orange/10 text-brand-orange border-brand-orange"
                                    : ""
                                }`}
                                style={{ borderColor: "var(--surface-border)" }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                          <p className="mt-4 text-xs opacity-50 flex items-center gap-2">
                            <Info size={12} /> All calls are 20 minutes
                          </p>
                        </div>

                        <div
                          className="grid grid-cols-3 gap-3 pt-2 border-t"
                          style={{ borderColor: "var(--surface-border)" }}
                        >
                          <MetaItem
                            icon={Calendar}
                            label="Duration"
                            value="20 min call"
                          />
                          <MetaItem
                            icon={Globe}
                            label="Time Zone"
                            value="India — IST (GMT+5:30)"
                          />
                          <MetaItem
                            icon={Video}
                            label="Meeting Type"
                            value="Google Meet"
                          />
                        </div>

                        <div className="space-y-3 pt-2">
                          <button
                            disabled={!state.date || !state.time}
                            onClick={() => setStep(2)}
                            className="btn btn-primary w-full justify-center"
                          >
                            Continue <ArrowRight size={16} />
                          </button>
                          <p className="text-xs text-center opacity-60 flex items-center justify-center gap-2">
                            <Lock size={12} />
                            Your information is secure and will only be used to
                            schedule this call.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!confirmed && step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <StepHeader step={2} />
                  <div className="grid lg:grid-cols-12 gap-10 mt-10">
                    <div className="lg:col-span-4">
                      <SectionTag>Book a call</SectionTag>
                      <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                        Almost done. Just a few{" "}
                        <span className="text-brand-orange">details</span> left.
                      </h1>
                      <p className="mt-6 text-body-lg opacity-70 max-w-md">
                        Tell us a bit about yourself and your project so we can
                        make the most of our call.
                      </p>

                      <div className="mt-10 space-y-3">
                        <InfoRow
                          icon={Target}
                          title="Relevant conversation"
                          desc="We'll come prepared for your project."
                        />
                        <InfoRow
                          icon={ShieldCheck}
                          title="Your time, respected"
                          desc="No spam. No pitch. Just solutions."
                        />
                        <InfoRow
                          icon={Clock}
                          title="Focused & productive"
                          desc="We make every minute count."
                        />
                      </div>

                      <p className="mt-10 text-sm opacity-60">
                        Questions? Contact us at{" "}
                        <a
                          href="mailto:hello@oct20five.com"
                          className="text-brand-orange underline underline-offset-4"
                        >
                          hello@oct20five.com
                        </a>
                      </p>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      {/* Selected slot bar */}
                      <div className="brand-card !p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-11 h-11 rounded-icon border flex items-center justify-center text-brand-orange shrink-0"
                            style={{ borderColor: "var(--surface-border)" }}
                          >
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] uppercase opacity-50">
                              Your selected slot
                            </p>
                            <p className="font-display text-lg uppercase leading-tight">
                              {dateLabel}
                            </p>
                            <p className="text-xs opacity-60 mt-0.5">
                              {state.time} IST &bull; 20 min call &bull; Google
                              Meet
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="btn btn-outline !w-auto !py-2 !px-4 text-xs shrink-0"
                        >
                          <Pencil size={12} /> Change slot
                        </button>
                      </div>

                      <form
                        className="brand-card !p-6 md:!p-8 space-y-8"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!canConfirm) return;
                          setSending(true);
                          setError("");
                          const qs = new URLSearchParams(window.location.search);
                          const res = await submitLead({
                            kind: "call",
                            name: state.name,
                            email: state.email,
                            service: state.needs.join(", "),
                            plan: qs.get("plan") || "",
                            message: state.project,
                            details: {
                              role: state.role,
                              requestedDate: dateLabel || "",
                              requestedTime: state.time ? `${state.time} IST` : "",
                            },
                          });
                          setSending(false);
                          if (res.ok) setConfirmed(true);
                          else if (res.fallback)
                            setError("We couldn't send this automatically, so we opened an email with your request. Please press send.");
                          else setError(res.error || "Something went wrong. Please try again.");
                        }}
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <FieldGroup label="Full name" required>
                            <div className="relative">
                              <User
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
                              />
                              <input
                                required
                                value={state.name}
                                onChange={(e) =>
                                  setField("name", e.target.value)
                                }
                                className="brand-input !pl-10"
                                placeholder="Enter your full name"
                              />
                            </div>
                          </FieldGroup>
                          <FieldGroup label="Email address" required>
                            <div className="relative">
                              <Mail
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
                              />
                              <input
                                required
                                type="email"
                                value={state.email}
                                onChange={(e) =>
                                  setField("email", e.target.value)
                                }
                                className="brand-input !pl-10"
                                placeholder="Enter your email address"
                              />
                            </div>
                          </FieldGroup>
                        </div>

                        <FieldGroup label="What best describes you?" required>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {REACHING.map(({ label, icon: Icon }) => (
                              <button
                                key={label}
                                type="button"
                                onClick={() => setField("role", label)}
                                className={`pill !flex-col !items-center !justify-center !py-4 gap-2 text-center ${
                                  state.role === label ? "pill-active" : ""
                                }`}
                              >
                                <Icon size={18} />
                                <span className="text-xs uppercase tracking-tight leading-tight">
                                  {label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </FieldGroup>

                        <FieldGroup
                          label="What do you need help with?"
                          required
                        >
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {NEEDS.map(({ label, icon: Icon }) => (
                              <button
                                key={label}
                                type="button"
                                onClick={() => toggleNeed(label)}
                                className={`relative pill !flex-col !items-center !justify-center !py-4 gap-2 text-center ${
                                  state.needs.includes(label)
                                    ? "pill-active"
                                    : ""
                                }`}
                              >
                                {state.needs.includes(label) && (
                                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange" />
                                )}
                                <Icon size={18} />
                                <span className="text-[11px] uppercase tracking-tight leading-tight">
                                  {label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </FieldGroup>

                        <FieldGroup
                          label="Tell us a little about your project"
                          tag="Optional"
                          hint={`${state.project.length}/1000`}
                        >
                          <textarea
                            maxLength={1000}
                            value={state.project}
                            onChange={(e) =>
                              setField("project", e.target.value)
                            }
                            className="brand-textarea"
                            placeholder="Share a few details about your project, goals, or what you're looking to achieve."
                            rows={3}
                          />
                        </FieldGroup>

                        <div className="space-y-3 pt-2">
                          {error && (
                            <p role="alert" className="rounded-card border border-brand-orange px-4 py-3 text-sm text-brand-orange">
                              {error}
                            </p>
                          )}
                          <button
                            type="submit"
                            disabled={!canConfirm}
                            aria-busy={sending}
                            className="btn btn-primary w-full justify-center"
                          >
                            {sending ? "Sending…" : "Request this call"} <ArrowRight size={16} />
                          </button>
                          <p className="text-xs text-center opacity-60 flex items-center justify-center gap-2">
                            <Lock size={12} />
                            Your information is secure and will only be used to
                            schedule this call.
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {confirmed && (
                <motion.div
                  key="conf"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-3xl mx-auto text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative w-20 h-20 mx-auto"
                  >
                    <span className="absolute inset-0 rounded-full border border-brand-orange/30 animate-ping" />
                    <div className="relative w-20 h-20 rounded-full border-2 border-brand-orange text-brand-orange flex items-center justify-center shadow-brand-glow">
                      <Check size={32} strokeWidth={2.6} />
                    </div>
                  </motion.div>

                  <p className="mt-8 eyebrow mx-auto w-fit">
                    <span className="eyebrow-dot" /> Call request received
                  </p>
                  <h1 className="mt-4 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                    Request sent. <br />
                    <span className="text-brand-orange">We&rsquo;ll confirm soon.</span>
                  </h1>
                  <p className="mt-6 text-body-lg opacity-70 max-w-xl mx-auto">
                    We&rsquo;ve got your request. We&rsquo;ll email you to
                    confirm the time and send the meeting link.
                  </p>

                  <div className="mt-12 grid md:grid-cols-2 gap-5 text-left">
                    <div className="brand-card !p-0 overflow-hidden">
                      <ConfRow icon={Clock} title="20 min call" />
                      <ConfRow
                        icon={Calendar}
                        title={dateLabel || "\u2014"}
                        subtitle={state.time ? `${state.time} IST` : null}
                      />
                      <ConfRow
                        icon={Video}
                        title="Video call"
                        subtitle="Link sent on confirmation"
                        noBorder
                      />
                    </div>
                    <div className="brand-card">
                      <p className="eyebrow">
                        <Mail size={14} className="text-brand-orange" /> Check
                        your email
                      </p>
                      <p className="mt-4 text-sm opacity-80">
                        Your confirmation, meeting link, and booking details are
                        on their way to{" "}
                        <span className="text-brand-orange font-medium">
                          {state.email}
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 brand-card !flex !flex-col sm:!flex-row items-center justify-between gap-4 !py-4">
                    <p className="text-sm opacity-70 flex items-center gap-2 text-left">
                      <ChevronRight size={0} className="hidden" />
                      Need to reschedule or cancel? Use the link in your
                      confirmation email.
                    </p>
                    <Link href="/" className="btn btn-outline !w-auto shrink-0">
                      Back to OCT20FIVE <ArrowRight size={16} />
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <span
                      className="h-px flex-1"
                      style={{ background: "var(--surface-border)" }}
                    />
                    <span className="text-xs opacity-50 uppercase tracking-widest">
                      Or
                    </span>
                    <span
                      className="h-px flex-1"
                      style={{ background: "var(--surface-border)" }}
                    />
                  </div>

                  <button className="btn btn-primary w-full justify-center mt-6">
                    <Calendar size={16} /> Add to calendar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

function StepHeader({ step }) {
  const steps = [
    { n: "01", label: "Date & Time" },
    { n: "02", label: "Your Details" },
  ];
  return (
    <div className="flex items-center gap-4">
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = step === idx;
        const done = step > idx;
        return (
          <div key={s.n} className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                active || done ? "text-brand-orange" : "opacity-40"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold ${
                  active || done ? "border-brand-orange" : ""
                }`}
                style={{
                  borderColor:
                    active || done ? undefined : "var(--surface-border)",
                }}
              >
                {done ? <Check size={12} /> : s.n}
              </span>
              <span className="text-xs uppercase tracking-widest font-medium">
                {s.label}
              </span>
            </div>
            {idx < steps.length && (
              <span
                className="h-px w-10 sm:w-24"
                style={{ background: "var(--surface-border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ icon: Icon, title, desc }) {
  return (
    <div className="brand-card !p-5 flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-icon border flex items-center justify-center text-brand-orange shrink-0"
        style={{ borderColor: "var(--surface-border)" }}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className="font-display text-sm uppercase tracking-tight">{title}</p>
        <p className="mt-1 text-sm opacity-60">{desc}</p>
      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-icon border flex items-center justify-center text-brand-orange shrink-0"
        style={{ borderColor: "var(--surface-border)" }}
      >
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase opacity-50">{label}</p>
        <p className="text-xs font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ConfRow({ icon: Icon, title, subtitle, noBorder }) {
  return (
    <div
      className={`flex items-center gap-4 p-5 ${noBorder ? "" : "border-b"}`}
      style={{ borderColor: "var(--surface-border)" }}
    >
      <div
        className="w-10 h-10 rounded-icon border flex items-center justify-center text-brand-orange shrink-0"
        style={{ borderColor: "var(--surface-border)" }}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className="font-display text-sm uppercase tracking-tight">{title}</p>
        {subtitle && <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function FieldGroup({ label, hint, tag, required, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="eyebrow">
          <span className="eyebrow-dot" /> {label}
          {required && <span className="text-brand-orange"> *</span>}
          {tag && (
            <span className="ml-2 text-[11px] opacity-50 normal-case">
              ({tag})
            </span>
          )}
        </label>
        {hint && <span className="text-xs opacity-60">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
