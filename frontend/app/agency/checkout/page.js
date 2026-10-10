"use client";

import { Suspense, useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Tag,
  Pencil,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  CreditCard,
  Wallet,
  Landmark,
  BadgeIndianRupee,
  Calendar,
  Clock,
  Info,
  Sparkles,
  X,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import { adaptService, priceFor } from "@/data/plans";
import { api } from "@/lib/api";
import { fetchService } from "@/lib/catalog";
import { startPayment, waitForPaid } from "@/lib/payment";

/* =========================================================
   PLAN CATALOG — comes from the backend (`/public/catalog`).
   The browser never decides a price: the cart is a list of
   identifiers and the SERVER quotes and charges it.
========================================================= */
function buildCheckoutPlan(svc, planKey) {
  const model = adaptService(svc);
  if (!model) return null;
  const plan = model.plans.find((p) => p.key === planKey) || model.plans.find((p) => p.featured) || model.plans[0];
  const packages =
    model.mode === "project"
      ? [{ id: "project", packId: undefined, label: "Fixed price", price: plan.unit, unitLabel: "1 project" }]
      : plan.packs.map((k) => {
          const p = priceFor(plan, k.quantity, model.discounts);
          return {
            id: k.id,
            packId: k.id,
            quantity: k.quantity,
            label: k.label,
            price: p.total,
            unitLabel: `${k.quantity} ${k.quantity === 1 ? model.noun.one : model.noun.many}`,
          };
        });
  return {
    service: model.slug,
    planKey: plan.key,
    name: `${model.title} · ${plan.name}`,
    packages,
    features: plan.features,
    addons: model.addons.map((a) => ({ id: a.code, label: a.label, price: a.price })),
    defaultPack: model.defaultPack,
  };
}

function formatINR(n) {
  const v = Number(n) || 0;
  return `₹${v.toLocaleString("en-IN", { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

function CheckoutInner() {
  const params = useSearchParams();
  const serviceSlug = params.get("service") || "editing";
  const planKey = params.get("plan") || "advance";
  const [state, setState] = useState({ loading: true, svc: null, error: "" });

  useEffect(() => {
    let live = true;
    setState({ loading: true, svc: null, error: "" });
    fetchService(serviceSlug).then((svc) => {
      if (!live) return;
      setState(svc ? { loading: false, svc, error: "" } : { loading: false, svc: null, error: "We couldn't load this package right now." });
    });
    return () => { live = false; };
  }, [serviceSlug]);

  if (state.loading || !state.svc) {
    return (
      <>
        <Navbar variant="utility" initialTheme="dark" />
        <main>
          <SectionWrapper theme="dark" className="!pt-40 !pb-20">
            <div className="container text-center">
              {state.loading ? (
                <p className="opacity-70">Loading your package…</p>
              ) : (
                <>
                  <p className="opacity-80">{state.error}</p>
                  <Link href="/agency" className="btn btn-outline mt-6 !w-auto">Back to services</Link>
                </>
              )}
            </div>
          </SectionWrapper>
        </main>
        <Footer />
      </>
    );
  }
  return <CheckoutForm key={serviceSlug + planKey} svc={state.svc} planKey={planKey} initialPackage={params.get("pack")} />;
}

function CheckoutForm({ svc, planKey, initialPackage }) {
  const plan = useMemo(() => buildCheckoutPlan(svc, planKey), [svc, planKey]);
  const ADDONS = plan.addons;

  const [step, setStep] = useState(1);
  
  const [order, setOrder] = useState(null); // set only once the backend reports PAID
  const idemKey = useRef(null);

  const [selectedPackage, setSelectedPackage] = useState(
    plan.packages.find((p) => String(p.quantity) === String(initialPackage))?.id ||
      plan.packages.find((p) => p.quantity === plan.defaultPack)?.id ||
      plan.packages[Math.min(1, plan.packages.length - 1)].id,
  );
  const [addons, setAddons] = useState([]);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // { code } once the server accepted it
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [promoError, setPromoError] = useState("");

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    gst: "",
    address: "",
    notes: "",
  });

  const [agree, setAgree] = useState(false);

  const setDetail = (k, v) => setDetails((s) => ({ ...s, [k]: v }));

  const toggleAddon = (id) =>
    setAddons((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const activePackage = plan.packages.find((p) => p.id === selectedPackage);

  const cartBody = useMemo(
    () => ({
      serviceSlug: plan.service,
      planSlug: plan.planKey,
      ...(activePackage?.packId ? { packId: activePackage.packId } : {}),
      ...(addons.length ? { addonCodes: addons } : {}),
      ...(promoApplied ? { promoCode: promoApplied.code } : {}),
    }),
    [plan, activePackage, addons, promoApplied],
  );
  const cartKey = JSON.stringify(cartBody);

  // Every figure shown comes from the server's quote (debounced).
  useEffect(() => {
    let live = true;
    const t = setTimeout(async () => {
      try {
        const q = await api("/checkout/quote", { method: "POST", body: JSON.parse(cartKey) });
        if (live) { setQuote(q); setQuoteError(""); }
      } catch (e) {
        if (!live) return;
        const parsed = JSON.parse(cartKey);
        if (parsed.promoCode) {
          setPromoApplied(null);
          setPromoError(e.message || "Invalid promo code");
        } else setQuoteError(e.message);
      }
    }, 150);
    return () => { live = false; clearTimeout(t); };
  }, [cartKey]);

  // a different cart is a different order: never reuse the previous idempotency key
  useEffect(() => { idemKey.current = null; }, [cartKey]);

  const subtotal = quote ? quote.packTotal + quote.addonsTotal : 0;
  const discount = quote?.promoDiscount || 0;
  const gst = quote?.taxAmount || 0;
  const total = quote?.total || 0;
  const addonTotal = quote?.addonsTotal || 0;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    setPromoError("");
    setPromoApplied({ code }); // the quote effect validates it server-side and clears it if invalid
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromo("");
    setPromoError("");
  };

  const canContinueStep1 = !!selectedPackage && !!quote;
  const canContinueStep2 =
    details.name && details.email && details.phone && details.address;
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const canConfirmPayment = agree && !submitting;
  const goToStep2 = () => canContinueStep1 && setStep(2);
  const goToStep3 = () => canContinueStep2 && setStep(3);

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!canConfirmPayment) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      if (!idemKey.current) idemKey.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const notes = [details.address && `Address: ${details.address}`, details.notes].filter(Boolean).join("\n");
      const created = await api("/checkout/orders", {
        method: "POST",
        headers: { "Idempotency-Key": idemKey.current },
        body: {
          ...cartBody,
          name: details.name,
          email: details.email,
          phone: details.phone,
          ...(details.company ? { company: details.company } : {}),
          ...(details.gst ? { gstin: details.gst } : {}),
          ...(notes ? { notes } : {}),
          acceptTerms: true,
        },
      });
      if (!created.payment) {
        setOrder(created.order);
        return;
      }
      const result = await startPayment(created);
      if (result.paid) {
        setOrder(result.order || created.order);
      } else if (result.cancelled) {
        setSubmitError("Payment was cancelled. You haven't been charged — you can try again.");
      } else if (result.failed) {
        setSubmitError("The payment didn't go through. You haven't been charged — please try again.");
      } else {
        // the gateway said done but our verification is pending: ask the backend, never assume
        const final = await waitForPaid(created.order.orderNumber, created.accessToken);
        if (final?.status === "paid") setOrder(final);
        else setSubmitError("We're still waiting for your bank to confirm. If you were charged, you'll get an email shortly — otherwise please try again.");
      }
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-20">
          <div className="container">
            <AnimatePresence mode="wait">
              {/* ================= STEP 1 — CART / PLAN REVIEW ================= */}
              {!order && step === 1 && (
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
                      <SectionTag>Checkout</SectionTag>
                      <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                        Review your{" "}
                        <span className="text-brand-orange">order</span> before
                        you continue.
                      </h1>
                      <p className="mt-6 text-body-lg opacity-70 max-w-md">
                        Confirm your package, add anything extra, and apply a
                        promo code if you have one.
                      </p>

                      <div className="mt-10 space-y-3">
                        <InfoRow
                          icon={ShieldCheck}
                          title="Secure checkout"
                          desc="Encrypted payment, always."
                        />
                        <InfoRow
                          icon={Sparkles}
                          title="No hidden fees"
                          desc="What you see is what you pay."
                        />
                        <InfoRow
                          icon={Clock}
                          title="Instant confirmation"
                          desc="Kickoff starts right after payment."
                        />
                      </div>

                      <p className="mt-10 text-sm opacity-60">
                        Not sure this is the right fit?{" "}
                        <Link
                          href="/agency/book-a-call"
                          className="text-brand-orange underline underline-offset-4"
                        >
                          Book a call
                        </Link>{" "}
                        instead.
                      </p>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      {/* Plan card */}
                      <div className="brand-card !p-6 md:!p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <p className="eyebrow">
                            <span className="eyebrow-dot" /> 1. Your package
                          </p>
                          <span className="text-xs uppercase opacity-50">
                            {plan.name} plan
                          </span>
                        </div>

                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${plan.packages.length}, minmax(0, 1fr))` }}>
                          {plan.packages.map((p) => {
                            const selected = p.id === selectedPackage;
                            return (
                              <button
                                key={p.id}
                                onClick={() => setSelectedPackage(p.id)}
                                className={`pill !flex-col !items-center !justify-center !py-4 gap-1 text-center ${
                                  selected ? "pill-active" : ""
                                }`}
                              >
                                <span className="text-xs uppercase tracking-tight font-semibold">
                                  {p.label}
                                </span>
                                <span className="text-xs opacity-60">
                                  {formatINR(p.price)}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div
                          className="pt-4 border-t"
                          style={{ borderColor: "var(--surface-border)" }}
                        >
                          <p className="text-xs uppercase opacity-50 mb-3">
                            Includes
                          </p>
                          <ul className="space-y-2">
                            {plan.features.map((f) => (
                              <li
                                key={f}
                                className="flex items-start gap-2 text-sm opacity-80"
                              >
                                <Check
                                  size={14}
                                  className="shrink-0 mt-0.5 text-brand-orange"
                                />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div className={`brand-card !p-6 md:!p-8 space-y-4 ${ADDONS.length ? "" : "hidden"}`}>
                        <p className="eyebrow">
                          <span className="eyebrow-dot" /> 2. Add-ons{" "}
                          <span className="ml-2 text-xs opacity-50 normal-case">
                            (Optional)
                          </span>
                        </p>
                        <div className="space-y-2">
                          {ADDONS.map((a) => {
                            const active = addons.includes(a.id);
                            return (
                              <button
                                key={a.id}
                                onClick={() => toggleAddon(a.id)}
                                className={`w-full flex items-center justify-between rounded-card border px-4 py-3 text-left transition-colors ${
                                  active ? "border-brand-orange" : ""
                                }`}
                                style={{
                                  borderColor: active
                                    ? undefined
                                    : "var(--surface-border)",
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                      active
                                        ? "bg-brand-orange border-brand-orange"
                                        : ""
                                    }`}
                                    style={{
                                      borderColor: active
                                        ? undefined
                                        : "var(--surface-border)",
                                    }}
                                  >
                                    {active && (
                                      <Check size={12} className="text-brand-cream" />
                                    )}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {a.label}
                                  </span>
                                </div>
                                <span className="text-sm opacity-70">
                                  +{formatINR(a.price)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Promo + summary */}
                      <div className="brand-card !p-6 md:!p-8 space-y-5">
                        <p className="eyebrow">
                          <span className="eyebrow-dot" /> 3. Promo code{" "}
                          <span className="ml-2 text-xs opacity-50 normal-case">
                            (Optional)
                          </span>
                        </p>

                        {!promoApplied ? (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Tag
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
                              />
                              <input
                                value={promo}
                                onChange={(e) => setPromo(e.target.value)}
                                className="brand-input !pl-10"
                                placeholder="Enter promo code"
                              />
                            </div>
                            <button
                              onClick={applyPromo}
                              className="btn btn-outline !w-auto !py-0 px-5"
                            >
                              Apply
                            </button>
                          </div>
                        ) : (
                          <div
                            className="flex items-center justify-between rounded-card border px-4 py-3"
                            style={{ borderColor: "var(--surface-border)" }}
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <Tag size={14} className="text-brand-orange" />
                              <span className="font-medium">
                                {promoApplied.code}
                              </span>
                              <span className="opacity-60">
                                — {quote?.promoPercent ? `${quote.promoPercent}% off ` : ""}applied
                              </span>
                            </div>
                            <button
                              onClick={removePromo}
                              className="opacity-60 hover:opacity-100"
                              aria-label="Remove promo"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        {promoError && (
                          <p className="text-xs text-red-400 -mt-2">
                            {promoError}
                          </p>
                        )}

                        <div
                          className="pt-4 border-t space-y-2"
                          style={{ borderColor: "var(--surface-border)" }}
                        >
                          <SummaryLine
                            label={`${plan.name} — ${activePackage?.label}`}
                            value={formatINR(quote ? quote.packTotal : activePackage?.price || 0)}
                          />
                          {addons.map((id) => {
                            const a = ADDONS.find((x) => x.id === id);
                            return (
                              <SummaryLine
                                key={id}
                                label={a.label}
                                value={`+${formatINR(a.price)}`}
                                muted
                              />
                            );
                          })}
                          {promoApplied && (
                            <SummaryLine
                              label={`Promo (${promoApplied.code})`}
                              value={`−${formatINR(discount)}`}
                              accent
                            />
                          )}
                          <SummaryLine
                            label="GST (18%)"
                            value={formatINR(gst)}
                            muted
                          />
                          <div
                            className="pt-3 mt-2 border-t flex items-center justify-between"
                            style={{ borderColor: "var(--surface-border)" }}
                          >
                            <span className="font-display uppercase text-sm tracking-tight">
                              Estimated total
                            </span>
                            <span className="font-display text-2xl uppercase tracking-tight text-brand-orange">
                              {formatINR(total)}
                            </span>
                          </div>
                        </div>

                        <button
                          disabled={!canContinueStep1}
                          onClick={goToStep2}
                          className="btn btn-primary w-full justify-center"
                        >
                          Continue to details <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 2 — DETAILS ================= */}
              {!order && step === 2 && (
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
                      <SectionTag>Checkout</SectionTag>
                      <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                        Where should we{" "}
                        <span className="text-brand-orange">send</span> the
                        invoice?
                      </h1>
                      <p className="mt-6 text-body-lg opacity-70 max-w-md">
                        We&rsquo;ll use these details for your invoice, project
                        kickoff, and all future communication.
                      </p>

                      <OrderMini
                        plan={plan}
                        activePackage={activePackage}
                        total={total}
                        onEdit={() => setStep(1)}
                      />
                    </div>

                    <div className="lg:col-span-8">
                      <form
                        className="brand-card !p-6 md:!p-8 space-y-8"
                        onSubmit={(e) => {
                          e.preventDefault();
                          goToStep3();
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
                                value={details.name}
                                onChange={(e) =>
                                  setDetail("name", e.target.value)
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
                                value={details.email}
                                onChange={(e) =>
                                  setDetail("email", e.target.value)
                                }
                                className="brand-input !pl-10"
                                placeholder="you@example.com"
                              />
                            </div>
                          </FieldGroup>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FieldGroup label="Phone number" required>
                            <div className="relative">
                              <Phone
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
                              />
                              <input
                                required
                                type="tel"
                                value={details.phone}
                                onChange={(e) =>
                                  setDetail("phone", e.target.value)
                                }
                                className="brand-input !pl-10"
                                placeholder="+91 00000 00000"
                              />
                            </div>
                          </FieldGroup>
                          <FieldGroup label="Company name" tag="Optional">
                            <div className="relative">
                              <Building2
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
                              />
                              <input
                                value={details.company}
                                onChange={(e) =>
                                  setDetail("company", e.target.value)
                                }
                                className="brand-input !pl-10"
                                placeholder="Business or brand name"
                              />
                            </div>
                          </FieldGroup>
                        </div>

                        <FieldGroup label="Billing address" required>
                          <div className="relative">
                            <MapPin
                              size={16}
                              className="absolute left-4 top-4 opacity-50"
                            />
                            <textarea
                              required
                              value={details.address}
                              onChange={(e) =>
                                setDetail("address", e.target.value)
                              }
                              className="brand-textarea !pl-10"
                              placeholder="Address, city, state, PIN code"
                              rows={3}
                            />
                          </div>
                        </FieldGroup>

                        <FieldGroup
                          label="GSTIN"
                          tag="Optional, for business invoice"
                        >
                          <input
                            value={details.gst}
                            onChange={(e) => setDetail("gst", e.target.value)}
                            className="brand-input"
                            placeholder="22AAAAA0000A1Z5"
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="Anything we should know before kickoff?"
                          tag="Optional"
                          hint={`${details.notes.length}/500`}
                        >
                          <textarea
                            maxLength={500}
                            value={details.notes}
                            onChange={(e) => setDetail("notes", e.target.value)}
                            className="brand-textarea"
                            placeholder="Brand guidelines, references, deadlines..."
                            rows={3}
                          />
                        </FieldGroup>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn btn-outline !w-auto !px-5"
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={!canContinueStep2}
                            className="btn btn-primary flex-1 justify-center"
                          >
                            Continue to payment <ArrowRight size={16} />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 3 — PAYMENT ================= */}
              {!order && step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <StepHeader step={3} />
                  <div className="grid lg:grid-cols-12 gap-10 mt-10">
                    <div className="lg:col-span-4">
                      <SectionTag>Checkout</SectionTag>
                      <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                        Last step.{" "}
                        <span className="text-brand-orange">
                          Confirm your order.
                        </span>
                      </h1>
                      <p className="mt-6 text-body-lg opacity-70 max-w-md">
                        Check your details and pay securely. Your workspace is
                        created and your welcome email sent as soon as the
                        payment is confirmed.
                      </p>

                      <OrderMini
                        plan={plan}
                        activePackage={activePackage}
                        total={total}
                        onEdit={() => setStep(1)}
                      />

                      <div className="mt-4 flex items-center gap-2 text-xs opacity-50">
                        <ShieldCheck size={12} /> Payments are processed by our payment partner
                      </div>
                    </div>

                    <div className="lg:col-span-8">
                      <form
                        onSubmit={submitPayment}
                        className="brand-card !p-6 md:!p-8 space-y-8"
                      >
                        <div
                          className="pt-4 border-t space-y-2"
                          style={{ borderColor: "var(--surface-border)" }}
                        >
                          <SummaryLine
                            label={`${plan.name} — ${activePackage?.label}`}
                            value={formatINR(quote ? quote.packTotal : activePackage?.price || 0)}
                            muted
                          />
                          {addons.length > 0 && (
                            <SummaryLine
                              label={`${addons.length} add-on${addons.length > 1 ? "s" : ""}`}
                              value={`+${formatINR(addonTotal)}`}
                              muted
                            />
                          )}
                          {promoApplied && (
                            <SummaryLine
                              label={`Promo (${promoApplied.code})`}
                              value={`−${formatINR(discount)}`}
                              accent
                            />
                          )}
                          <SummaryLine
                            label="GST (18%)"
                            value={formatINR(gst)}
                            muted
                          />
                          <div
                            className="pt-3 mt-2 border-t flex items-center justify-between"
                            style={{ borderColor: "var(--surface-border)" }}
                          >
                            <span className="font-display uppercase text-sm tracking-tight">
                              Estimated total
                            </span>
                            <span className="font-display text-2xl uppercase tracking-tight text-brand-orange">
                              {formatINR(total)}
                            </span>
                          </div>
                        </div>

                        <label className="flex items-start gap-3 text-xs opacity-70 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-0.5"
                          />
                          I agree to the{" "}
                          <Link
                            href="/agency/terms-and-conditions"
                            className="text-brand-orange underline underline-offset-4"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/agency/refund-and-cancellation"
                            className="text-brand-orange underline underline-offset-4"
                          >
                            Refund Policy
                          </Link>
                          .
                        </label>

                        {submitError && (
                          <p role="alert" className="rounded-card border border-brand-orange px-4 py-3 text-sm text-brand-orange">
                            {submitError}
                          </p>
                        )}
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="btn btn-outline !w-auto !px-5"
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={!canConfirmPayment}
                            className="btn btn-primary flex-1 justify-center"
                          >
                            {submitting ? "Processing…" : `Pay securely · ${formatINR(total)}`}
                          </button>
                        </div>
                        <p className="text-xs text-center opacity-60 flex items-center justify-center gap-2">
                          <ShieldCheck size={12} />
                          Total includes 18% GST. Card, UPI and netbanking are available at the payment step.
                        </p>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= CONFIRMATION ================= */}
              {order && (
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
                    <span className="eyebrow-dot" /> Payment confirmed
                  </p>
                  <h1 className="mt-4 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                    Payment confirmed. <br />
                    <span className="text-brand-orange">
                      Let&rsquo;s get started.
                    </span>
                  </h1>
                  <p className="mt-6 text-body-lg opacity-70 max-w-xl mx-auto">
                    Thanks{details.name ? `, ${details.name}` : ""}. We&rsquo;ve
                    emailed your receipt and a secure link to set up your workspace to{" "}
                    <span className="text-brand-orange font-medium">
                      {details.email}
                    </span>
                    .
                  </p>

                  <div className="mt-12 grid md:grid-cols-2 gap-5 text-left">
                    <div className="brand-card !p-0 overflow-hidden">
                      <ConfRow
                        icon={Tag}
                        title={`Order ${order.orderNumber}`}
                        subtitle={`${plan.name} — ${activePackage?.label}`}
                      />
                      <ConfRow
                        icon={BadgeIndianRupee}
                        title={formatINR(order.total)}
                        subtitle="Paid · incl. GST"
                      />
                      <ConfRow
                        icon={Calendar}
                        title={new Date().toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                        subtitle="Order date"
                        noBorder
                      />
                    </div>
                    <div className="brand-card">
                      <p className="eyebrow">
                        <Mail size={14} className="text-brand-orange" /> What
                        happens next?
                      </p>
                      <ul className="mt-5 space-y-3 text-sm">
                        {[
                          "Open the email we sent and set your password",
                          "Your order, invoice and onboarding project are waiting in your workspace",
                          "Our team will reach out within 24 hours to kick off",
                        ].map((s) => (
                          <li key={s} className="flex items-start gap-3">
                            <Check
                              size={16}
                              className="shrink-0 mt-0.5 text-brand-orange"
                            />
                            <span className="opacity-85">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 brand-card !flex !flex-col sm:!flex-row items-center justify-between gap-4 !py-4">
                    <p className="text-sm opacity-70 text-left">
                      Need help or want to make changes to your order?{" "}
                      <a
                        href="mailto:hello@oct20five.com"
                        className="text-brand-orange underline underline-offset-4"
                      >
                        hello@oct20five.com
                      </a>
                    </p>
                    <Link href="/agency/login" className="btn btn-primary !w-auto shrink-0">
                      Go to your workspace <ArrowRight size={16} />
                    </Link>
                  </div>
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

/* =========================================================
   SHARED SUBCOMPONENTS (match book-a-call / get-in-touch)
========================================================= */

function StepHeader({ step }) {
  const steps = [
    { n: "01", label: "Review Order" },
    { n: "02", label: "Your Details" },
    { n: "03", label: "Payment" },
  ];
  return (
    <div className="flex items-center gap-4 flex-wrap">
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
                className="h-px w-10 sm:w-16"
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
            <span className="ml-2 text-xs opacity-50 normal-case">
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

function SummaryLine({ label, value, muted, accent }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? "opacity-60" : "opacity-85"}>{label}</span>
      <span
        className={`font-medium ${
          accent ? "text-brand-orange" : muted ? "opacity-60" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function OrderMini({ plan, activePackage, total, onEdit }) {
  return (
    <div className="mt-10 brand-card !p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-11 h-11 rounded-icon border flex items-center justify-center text-brand-orange shrink-0"
          style={{ borderColor: "var(--surface-border)" }}
        >
          <Tag size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase opacity-50">Your order</p>
          <p className="font-display text-base uppercase leading-tight truncate">
            {plan.name} — {activePackage?.label}
          </p>
          <p className="text-xs opacity-60 mt-0.5">{formatINR(total)} total</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="btn btn-outline !w-auto !py-2 !px-3 text-xs shrink-0"
      >
        <Pencil size={12} /> Edit
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
