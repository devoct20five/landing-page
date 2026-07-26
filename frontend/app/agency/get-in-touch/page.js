"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Upload,
  CalendarClock,
  Mail,
  X,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/motion/Reveal";

const REACHING = [
  "Individual/Creator",
  "Brand/Business",
  "Agency/Studio",
  "Other",
];
const NEEDS = [
  "Editing",
  "Design",
  "3D Ads",
  "Web Dev",
  "Multiple Services",
  "Not Sure Yet",
];
const BUDGET = [
  "Under 10K",
  "10K – 25K",
  "25K – 50K",
  "50K – 1L",
  "1L+",
  "Not Sure Yet",
];
const TIMELINE = [
  "ASAP",
  "Within 2 weeks",
  "This month",
  "This quarter",
  "Flexible",
  "Not Sure Yet",
];

export default function GetInTouchPage() {
  const [state, setState] = useState({
    role: "Brand/Business",
    name: "",
    email: "",
    needs: [],
    project: "",
    budget: "",
    timeline: "",
    file: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const setField = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const toggleNeed = (n) =>
    setState((s) => ({
      ...s,
      needs: s.needs.includes(n)
        ? s.needs.filter((x) => x !== n)
        : [...s.needs, n],
    }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar variant="utility" initialTheme="light" />
      <main>
        <SectionWrapper theme="light" className="!pt-40 !pb-16">
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
                    <div className="lg:col-span-5">
                      <SectionTag>Get in touch</SectionTag>
                      <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-xl text-balance">
                        Ready to start? <br />
                        <span className="text-brand-orange italic font-medium normal-case tracking-tight">
                          Or still figuring it out?
                        </span>
                      </h1>
                      <p className="mt-6 text-body-lg opacity-75 max-w-md">
                        Two ways in. Pick the one that feels right — we don’t
                        judge.
                      </p>

                      <div className="mt-10 space-y-3">
                        <Link
                          href="/agency/book-a-call"
                          className="group flex items-center gap-4 brand-card !p-5 hover:!bg-brand-dark hover:!text-brand-cream transition-colors"
                        >
                          <div
                            className="w-12 h-12 rounded-icon border flex items-center justify-center text-brand-orange group-hover:border-white"
                            style={{ borderColor: "var(--surface-border)" }}
                          >
                            <CalendarClock size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display text-xl uppercase">
                              Book a Call
                            </h3>
                            <p className="text-sm opacity-70">
                              20 minutes with a lead.
                            </p>
                          </div>
                          <ArrowRight
                            size={18}
                            className="transition-transform duration-500 ease-apple group-hover:translate-x-2"
                          />
                        </Link>
                        <a
                          href="#form"
                          className="flex items-center gap-4 brand-card !p-5 !bg-brand-orange !text-white border-brand-orange"
                        >
                          <div className="w-12 h-12 rounded-icon border border-white/40 flex items-center justify-center">
                            <Mail size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display text-xl uppercase">
                              Fill out form
                            </h3>
                            <p className="text-sm opacity-90">
                              Scoped brief in under 3 min.
                            </p>
                          </div>
                          <ArrowRight size={18} />
                        </a>
                      </div>
                    </div>

                    {/* Right column form */}
                    <div className="lg:col-span-7" id="form">
                      <form
                        onSubmit={onSubmit}
                        className="brand-card !p-8 md:!p-10 space-y-8"
                      >
                        <FieldGroup label="You’re reaching out as…">
                          <div className="flex flex-wrap gap-2">
                            {REACHING.map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setField("role", r)}
                                className={`pill ${state.role === r ? "pill-active" : ""}`}
                              >
                                {r}
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
                              placeholder="Jane Doe"
                            />
                          </FieldGroup>
                          <FieldGroup label="Your email">
                            <input
                              required
                              type="email"
                              value={state.email}
                              onChange={(e) =>
                                setField("email", e.target.value)
                              }
                              className="brand-input"
                              placeholder="jane@brand.com"
                            />
                          </FieldGroup>
                        </div>

                        <FieldGroup label="What do you need?">
                          <div className="flex flex-wrap gap-2">
                            {NEEDS.map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => toggleNeed(n)}
                                className={`pill ${state.needs.includes(n) ? "pill-active" : ""}`}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </FieldGroup>

                        <FieldGroup
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
                            placeholder="A rough idea of the brief — what you're trying to make, who it's for, references you love…"
                            rows={4}
                          />
                        </FieldGroup>

                        <FieldGroup label="Budget">
                          <div className="flex flex-wrap gap-2">
                            {BUDGET.map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setField("budget", b)}
                                className={`pill ${state.budget === b ? "pill-active" : ""}`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </FieldGroup>

                        <FieldGroup label="Timeline">
                          <div className="flex flex-wrap gap-2">
                            {TIMELINE.map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setField("timeline", t)}
                                className={`pill ${state.timeline === t ? "pill-active" : ""}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </FieldGroup>

                        <FieldGroup label="Attach a file (optional, max 20MB)">
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
                                  : "Drop a brief, deck or reference video"}
                              </p>
                              <p className="text-xs opacity-60">
                                .pdf, .png, .jpg, .mp4 — up to 20MB
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

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                          <button type="submit" className="btn btn-primary">
                            Send brief <ArrowRight size={16} />
                          </button>
                          <p className="text-sm opacity-60">
                            We reply within one business day.
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

function FieldGroup({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="eyebrow">
          <span className="eyebrow-dot" /> {label}
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
      className="max-w-3xl mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="w-24 h-24 mx-auto rounded-full bg-brand-orange text-white flex items-center justify-center shadow-brand-glow"
      >
        <Check size={44} strokeWidth={2.4} />
      </motion.div>
      <p className="mt-8 eyebrow mx-auto w-fit">
        <span className="eyebrow-dot" /> Thank you!
      </p>
      <h1 className="mt-4 font-display uppercase leading-[0.9] tracking-tight text-display-xl text-balance">
        We&rsquo;ve got your <span className="text-brand-orange">message.</span>{" "}
        <br /> We&rsquo;ll get back to you.
      </h1>
      <p className="mt-6 text-body-lg opacity-75 max-w-xl mx-auto">
        Thanks for reaching out to OCT20FIVE{name ? `, ${name}` : ""}. Our team
        has received your details and will get back to you within 1&ndash;2
        business days at{" "}
        <span className="font-medium">{email || "your inbox"}</span>.
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-5 text-left">
        <div className="brand-card">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> What happens next?
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="opacity-85 mt-0.5">
                We&rsquo;ll review your message
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="opacity-85 mt-0.5">
                The right person will reach out
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="opacity-85 mt-0.5">
                We&rsquo;ll discuss how we can help
              </span>
            </li>
          </ul>
        </div>
        <div className="brand-card !bg-brand-orange !text-white border-brand-orange">
          <p className="eyebrow border-white/40 text-white/90">
            <span className="eyebrow-dot !bg-white" /> Response time
          </p>
          <h3 className="mt-4 font-display text-3xl uppercase leading-[0.95]">
            Within 1&ndash;2 <br /> business days
          </h3>
          <p className="mt-3 opacity-90 text-sm">
            We usually respond faster. Keep an eye on your inbox.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <p className="text-sm opacity-70">
          Have something urgent? Drop us an email at
        </p>
        <a
          href="mailto:hello@oct20five.com"
          className="underline underline-offset-4 text-brand-orange text-sm font-medium"
        >
          hello@oct20five.com
        </a>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="mailto:hello@oct20five.com" className="btn btn-primary">
          Email us directly <ArrowUpRight size={16} />
        </a>
        <Link href="/" className="btn btn-outline">
          Back to Home <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}
