"use client";

import { useState, useEffect } from "react";
import { submitLead } from "@/lib/submitLead";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  CalendarClock,
  Mail,
  MessageSquare,
  Clock,
  X,
  ArrowUpRight,
  User,
  Briefcase,
  Building2,
  MoreHorizontal,
  Scissors,
  PenTool,
  Box,
  Globe,
  LayoutGrid,
  CircleDot,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/motion/Reveal";

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
  { label: "Not Sure Yet", icon: CircleDot },
];

const BUDGET = [
  "Under ₹10K",
  "₹10K – ₹25K",
  "₹25K – ₹50K",
  "₹50K – ₹1L",
  "₹1L+",
  "Not Sure Yet",
];

const TIMELINE = [
  "ASAP",
  "1 – 2 Weeks",
  "This Month",
  "Flexible",
  "Not Sure Yet",
];

const SERVICE_LABEL = { editing: "Editing", design: "Design", "3d-ads": "3D Ads", "web-dev": "Web Dev" };

export default function GetInTouchPage() {
  const [state, setState] = useState({
    role: "Individual / Creator",
    name: "",
    email: "",
    needs: [],
    project: "",
    budget: "",
    timeline: "",
    file: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // ?service=editing (from a service page CTA) pre-selects that need
  useEffect(() => {
    const svc = new URLSearchParams(window.location.search).get("service");
    const label = SERVICE_LABEL[svc];
    if (label) setState((s) => (s.needs.includes(label) ? s : { ...s, needs: [label] }));
  }, []);

  const setField = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const toggleNeed = (n) =>
    setState((s) => ({
      ...s,
      needs: s.needs.includes(n)
        ? s.needs.filter((x) => x !== n)
        : [...s.needs, n],
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    const res = await submitLead({
      kind: "contact",
      name: state.name,
      email: state.email,
      service: state.needs.join(", "),
      message: state.project,
      details: { role: state.role, budget: state.budget, timeline: state.timeline },
    });
    setSending(false);
    if (res.ok) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (res.fallback) {
      setError("We couldn't send this automatically, so we opened an email with your details. Please press send to reach us.");
    } else {
      setError(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-16">
          <div className="container">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left column */}
                    <div className="lg:col-span-4">
                      <SectionTag>Get in touch</SectionTag>
                      <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                        Ready to start? <br />
                        <span className="text-brand-orange">
                          Or still figuring it out?
                        </span>
                      </h1>
                      <p className="mt-6 text-body-lg opacity-70 max-w-md">
                        Either works. Book a call if you&rsquo;re ready to talk
                        — or tell us what you have so far and we&rsquo;ll help
                        figure out what comes next.
                      </p>

                      <div className="mt-10 space-y-0">
                        {/* Step 01 */}
                        <div className="brand-card !p-6 flex items-start gap-5">
                          <span className="font-display text-4xl leading-none opacity-30">
                            01
                          </span>
                          <div className="flex-1">
                            <p className="eyebrow">
                              <span className="eyebrow-dot" /> I know what I
                              need
                            </p>
                            <h3 className="mt-3 font-display text-2xl uppercase">
                              Let&rsquo;s talk.
                            </h3>
                            <p className="mt-2 text-sm opacity-70">
                              You have a project, a direction, or a clear idea
                              of what you need. Pick a time and let&rsquo;s
                              discuss the details.
                            </p>
                            <Link
                              href="/agency/book-a-call"
                              className="btn btn-primary mt-5 !w-auto"
                            >
                              Book a call <ArrowUpRight size={16} />
                            </Link>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 py-3">
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

                        {/* Step 02 */}
                        <div className="brand-card !p-6 flex items-start gap-5">
                          <span className="font-display text-4xl leading-none text-brand-orange">
                            02
                          </span>
                          <div className="flex-1">
                            <p className="eyebrow">
                              <span className="eyebrow-dot" /> I&rsquo;m still
                              figuring it out
                            </p>
                            <h3 className="mt-3 font-display text-2xl uppercase">
                              Start with what you know.
                            </h3>
                            <p className="mt-2 text-sm opacity-70">
                              You don&rsquo;t need a perfect brief. Tell us the
                              idea, the problem, or whatever you have so far.
                            </p>
                            <a
                              href="#form"
                              className="btn btn-outline mt-5 !w-auto"
                            >
                              Fill out form <ArrowRight size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right column form */}
                    <div className="lg:col-span-8" id="form">
                      <form onSubmit={onSubmit}
                        className="brand-card !p-8 md:!p-10 space-y-8"
                      >
                        <div className="flex items-center gap-3 pb-2">
                          <div
                            className="w-9 h-9 rounded-icon border flex items-center justify-center text-brand-orange"
                            style={{ borderColor: "var(--surface-border)" }}
                          >
                            <MessageSquare size={16} />
                          </div>
                          <h2 className="font-display text-xl uppercase tracking-tight">
                            Tell us what you have so far
                          </h2>
                        </div>

                        <FieldGroup number="1" label="You’re reaching out as…">
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

                        <div className="grid md:grid-cols-2 gap-4">
                          <FieldGroup label="Your name">
                            <input
                              required
                              value={state.name}
                              onChange={(e) => setField("name", e.target.value)}
                              className="brand-input"
                              placeholder="Full name"
                            />
                          </FieldGroup>
                          <FieldGroup label="Email address">
                            <input
                              required
                              type="email"
                              value={state.email}
                              onChange={(e) =>
                                setField("email", e.target.value)
                              }
                              className="brand-input"
                              placeholder="you@example.com"
                            />
                          </FieldGroup>
                        </div>

                        <FieldGroup number="2" label="What do you need?">
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {NEEDS.map(({ label, icon: Icon }) => (
                              <button
                                key={label}
                                type="button"
                                onClick={() => toggleNeed(label)}
                                className={`pill !flex-col !items-center !justify-center !py-4 gap-2 text-center ${
                                  state.needs.includes(label)
                                    ? "pill-active"
                                    : ""
                                }`}
                              >
                                <Icon size={18} />
                                <span className="text-[11px] uppercase tracking-tight leading-tight">
                                  {label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </FieldGroup>

                        <FieldGroup
                          number="3"
                          label="Tell us about it"
                          hint={`${state.project.length}/1000`}
                        >
                          <textarea
                            maxLength={1000}
                            value={state.project}
                            onChange={(e) =>
                              setField("project", e.target.value)
                            }
                            className="brand-textarea"
                            placeholder="An idea, a problem, a rough brief — anything helps."
                            rows={4}
                          />
                        </FieldGroup>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FieldGroup label="Budget" tag="Optional">
                            <div className="grid grid-cols-3 gap-2">
                              {BUDGET.map((b) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => setField("budget", b)}
                                  className={`pill !justify-center text-center ${
                                    state.budget === b ? "pill-active" : ""
                                  }`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </FieldGroup>

                          <FieldGroup label="Timeline" tag="Optional">
                            <div className="grid grid-cols-3 gap-2">
                              {TIMELINE.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setField("timeline", t)}
                                  className={`pill !justify-center text-center ${
                                    state.timeline === t ? "pill-active" : ""
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </FieldGroup>
                        </div>

                        <FieldGroup label="Reference / Brief" tag="Optional">
                          <label
                            className="flex items-center gap-3 rounded-card border border-dashed p-6 cursor-pointer hover:border-brand-orange transition-colors"
                            style={{ borderColor: "var(--surface-border)" }}
                          >
                            <div
                              className="w-11 h-11 rounded-icon border flex items-center justify-center text-brand-orange"
                              style={{ borderColor: "var(--surface-border)" }}
                            >
                              <Upload size={18} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {state.file
                                  ? state.file.name
                                  : "Upload a brief, reference, deck, image, or anything that helps us understand the idea"}
                              </p>
                              <p className="text-xs opacity-60">
                                Max file size 20MB
                              </p>
                            </div>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={(e) =>
                                setField("file", e.target.files?.[0] || null)
                              }
                            />
                          </label>
                          {state.file && (
                            <button
                              type="button"
                              onClick={() => setField("file", null)}
                              className="mt-2 text-xs inline-flex items-center gap-1 opacity-70 hover:opacity-100"
                            >
                              <X size={12} /> Remove file
                            </button>
                          )}
                        </FieldGroup>

                        <div className="pt-2 space-y-3">
                          {error && (
                            <p role="alert" className="rounded-card border border-brand-orange px-4 py-3 text-sm text-brand-orange">
                              {error}
                            </p>
                          )}
                          <button
                            type="submit"
                            disabled={sending}
                            className="btn btn-primary w-full justify-center"
                          >
                            {sending ? "Sending…" : "Send it our way"} <ArrowRight size={16} />
                          </button>
                          <p className="text-xs text-center opacity-60 flex items-center justify-center gap-2">
                            <Check size={12} className="text-brand-orange" />
                            We&rsquo;ll get back to you within 1–2 business
                            days.
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <ConfirmationScreen
                  key="conf"
                  name={state.name}
                  email={state.email}
                />
              )}
            </AnimatePresence>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

function FieldGroup({ number, label, hint, tag, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="eyebrow">
          <span className="eyebrow-dot" />
          {number ? `${number}. ` : ""}
          {label}
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

function ConfirmationScreen({ name, email }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto text-center py-10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-20 h-20 mx-auto"
      >
        <span className="absolute inset-0 rounded-full border border-brand-orange/30 animate-ping" />
        <span className="absolute -inset-3 rounded-full border border-brand-orange/10" />
        <div className="relative w-20 h-20 rounded-full border-2 border-brand-orange text-brand-orange flex items-center justify-center shadow-brand-glow">
          <Check size={32} strokeWidth={2.6} />
        </div>
      </motion.div>

      <p className="mt-8 eyebrow mx-auto w-fit">
        <span className="eyebrow-dot" /> Thank you!
      </p>
      <h1 className="mt-4 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
        We&rsquo;ve got your message. <br />
        <span className="text-brand-orange">We&rsquo;ll get back to you.</span>
      </h1>
      <p className="mt-6 text-body-lg opacity-70 max-w-xl mx-auto">
        Thanks for reaching out to OCT20FIVE{name ? `, ${name}` : ""}. Our team
        has received your details and will get back to you within 1&ndash;2
        business days
        {email ? (
          <>
            {" "}
            at <span className="font-medium text-brand-orange">{email}</span>
          </>
        ) : (
          "."
        )}
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-5 text-left">
        <div className="brand-card">
          <p className="eyebrow">
            <Mail size={14} className="text-brand-orange" /> What happens next?
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              "We'll review your message",
              "The right person will reach out",
              "We'll discuss how we can help",
            ].map((step) => (
              <li key={step} className="flex items-start gap-3">
                <Check
                  size={16}
                  className="shrink-0 mt-0.5 text-brand-orange"
                />
                <span className="opacity-85">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="brand-card">
          <p className="eyebrow">
            <Clock size={14} className="text-brand-orange" /> Response time
          </p>
          <h3 className="mt-4 font-display text-2xl text-brand-orange uppercase leading-[1.05]">
            Within 1&ndash;2 <br /> business days
          </h3>
          <p className="mt-3 opacity-70 text-sm">
            We usually respond faster. Keep an eye on your inbox.
          </p>
        </div>
      </div>

      <div className="mt-10 brand-card !flex !flex-col sm:!flex-row items-center justify-between gap-4 !py-4">
        <p className="text-sm opacity-70 flex items-center gap-2">
          <MessageSquare size={14} className="text-brand-orange" />
          Have something urgent? Drop us an email at{" "}
          <a
            href="mailto:hello@oct20five.com"
            className="underline underline-offset-4 text-brand-orange font-medium"
          >
            hello@oct20five.com
          </a>
        </p>
        <a
          href="mailto:hello@oct20five.com"
          className="btn btn-primary !w-auto"
        >
          Email us directly <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
