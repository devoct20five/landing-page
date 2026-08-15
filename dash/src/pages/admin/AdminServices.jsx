import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Package,
  Check,
  X,
  ChevronRight,
} from "lucide-react";

import { SERVICES } from "@/data/services";
import { cn } from "@/lib/utils";

const SERVICE_LIST = Object.values(SERVICES);

function StatusBadge({ active }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em]",
        active
          ? "bg-emerald-500/10 text-emerald-700"
          : "bg-surface-muted/10 text-surface-muted"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-emerald-600" : "bg-surface-muted"
        )}
      />
      {active ? "Active" : "Draft"}
    </span>
  );
}

function PlanRow({ plan, service, onEdit, onDelete, onDuplicate }) {
  return (
    <div className="group flex items-center gap-4 border-b border-surface-border px-5 py-4 last:border-b-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
        <Package className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-display text-sm font-bold text-surface-fg">
            {plan.name}
          </p>

          {plan.featured && (
            <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-white">
              Featured
            </span>
          )}
        </div>

        <p className="mt-0.5 text-xs text-surface-muted">
          {plan.packages?.join(" · ") || "No packages configured"}
        </p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-sm font-bold text-surface-fg">
          {plan.price}
        </p>

        <p className="text-[0.65rem] text-surface-muted">
          Starting price
        </p>
      </div>

      {plan.discount && (
        <span className="hidden rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-700 md:inline-flex">
          {plan.discount} off
        </span>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(service, plan)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          title="Edit plan"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDuplicate(service, plan)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          title="Duplicate plan"
        >
          <Copy className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(service, plan)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-red-50 hover:text-red-600"
          title="Delete plan"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PlanEditor({ service, plan, onClose, onSave }) {
  const [form, setForm] = useState({
    name: plan?.name || "",
    icon: plan?.icon || "Package",
    price: plan?.price || "",
    total: plan?.total || "",
    discount: plan?.discount || "",
    featured: plan?.featured || false,
    packages: plan?.packages || [],
    features: plan?.features || [],
  });

  const [packageInput, setPackageInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const update = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const addPackage = () => {
    const value = packageInput.trim();

    if (!value) return;

    setForm((current) => ({
      ...current,
      packages: [...current.packages, value],
    }));

    setPackageInput("");
  };

  const removePackage = (index) => {
    setForm((current) => ({
      ...current,
      packages: current.packages.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    setForm((current) => ({
      ...current,
      features: [...current.features, value],
    }));

    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setForm((current) => ({
      ...current,
      features: current.features.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface-bg shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-surface-bg px-6 py-5">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-orange">
              {service.title}
            </p>

            <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
              {plan ? "Edit Plan" : "Create Plan"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-7 p-6">
          {/* Basic information */}
          <section>
            <h3 className="mb-4 font-display text-sm font-bold text-surface-fg">
              Basic Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Plan Name"
                value={form.name}
                onChange={update("name")}
                placeholder="Standard"
              />

              <Field
                label="Icon"
                value={form.icon}
                onChange={update("icon")}
                placeholder="Film"
              />

              <Field
                label="Price"
                value={form.price}
                onChange={update("price")}
                placeholder="₹3,000"
              />

              <Field
                label="Package Total"
                value={form.total}
                onChange={update("total")}
                placeholder="₹9,000"
              />

              <Field
                label="Discount"
                value={form.discount}
                onChange={update("discount")}
                placeholder="8%"
              />
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    featured: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-[var(--brand-orange)]"
              />

              <span>
                <span className="block text-sm font-semibold text-surface-fg">
                  Featured plan
                </span>

                <span className="block text-xs text-surface-muted">
                  Highlight this plan on the client pricing page.
                </span>
              </span>
            </label>
          </section>

          {/* Packages */}
          <section>
            <h3 className="mb-1 font-display text-sm font-bold text-surface-fg">
              Packages
            </h3>

            <p className="mb-4 text-xs text-surface-muted">
              Package options available under this plan.
            </p>

            <div className="flex gap-2">
              <input
                value={packageInput}
                onChange={(event) =>
                  setPackageInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addPackage();
                  }
                }}
                placeholder="e.g. 3 Pack"
                className="brand-input flex-1"
              />

              <button
                type="button"
                onClick={addPackage}
                className="rounded-xl bg-surface-fg px-4 text-sm font-semibold text-surface-bg"
              >
                Add
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {form.packages.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-surface-border px-3 py-1.5 text-xs font-medium text-surface-fg"
                >
                  {item}

                  <button
                    type="button"
                    onClick={() => removePackage(index)}
                    className="text-surface-muted hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="mb-1 font-display text-sm font-bold text-surface-fg">
              Plan Features
            </h3>

            <p className="mb-4 text-xs text-surface-muted">
              Features displayed to clients when comparing plans.
            </p>

            <div className="flex gap-2">
              <input
                value={featureInput}
                onChange={(event) =>
                  setFeatureInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="e.g. 48–72 Hour Delivery"
                className="brand-input flex-1"
              />

              <button
                type="button"
                onClick={addFeature}
                className="rounded-xl bg-surface-fg px-4 text-sm font-semibold text-surface-bg"
              >
                Add
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {form.features.map((feature, index) => (
                <div
                  key={`${feature}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-surface-border px-3.5 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />

                    <span className="text-sm text-surface-fg">
                      {feature}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-3 shrink-0 text-surface-muted hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-surface-border bg-surface-bg px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-surface-border px-4 py-2.5 text-sm font-semibold text-surface-fg transition hover:bg-surface-muted/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              onSave({
                ...form,
                selectedPackage: 0,
              })
            }
            className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white"
          >
            {plan ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="brand-input w-full"
      />
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState(SERVICE_LIST);
  const [selectedService, setSelectedService] =
    useState(SERVICE_LIST[0]);

  const [search, setSearch] = useState("");

  const [editor, setEditor] = useState(null);

  const filteredServices = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return services;

    return services.filter((service) =>
      service.title.toLowerCase().includes(query)
    );
  }, [services, search]);

  const activeService =
    services.find(
      (service) => service.slug === selectedService?.slug
    ) || services[0];

  const createPlan = () => {
    setEditor({
      service: activeService,
      plan: null,
    });
  };

  const editPlan = (service, plan) => {
    setEditor({
      service,
      plan,
    });
  };

  const duplicatePlan = (service, plan) => {
    const duplicated = {
      ...plan,
      name: `${plan.name} Copy`,
      featured: false,
    };

    setServices((current) =>
      current.map((item) =>
        item.slug !== service.slug
          ? item
          : {
              ...item,
              pricing: {
                ...item.pricing,
                plans: [
                  ...item.pricing.plans,
                  duplicated,
                ],
              },
            }
      )
    );
  };

  const deletePlan = (service, plan) => {
    const confirmed = window.confirm(
      `Delete the ${plan.name} plan from ${service.title}?`
    );

    if (!confirmed) return;

    setServices((current) =>
      current.map((item) =>
        item.slug !== service.slug
          ? item
          : {
              ...item,
              pricing: {
                ...item.pricing,
                plans: item.pricing.plans.filter(
                  (currentPlan) =>
                    currentPlan !== plan
                ),
              },
            }
      )
    );
  };

  const savePlan = (form) => {
    setServices((current) =>
      current.map((service) => {
        if (service.slug !== editor.service.slug) {
          return service;
        }

        const existingPlans =
          service.pricing?.plans || [];

        const plans = editor.plan
          ? existingPlans.map((plan) =>
              plan === editor.plan
                ? form
                : plan
            )
          : [...existingPlans, form];

        return {
          ...service,
          pricing: {
            ...service.pricing,
            plans,
          },
        };
      })
    );

    setEditor(null);
  };

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-orange">
            Administration
          </div>

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Services
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Manage the services, pricing plans and packages
            available to clients.
          </p>
        </div>

        <button
          type="button"
          onClick={createPlan}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)]"
        >
          <Plus className="h-4 w-4" />
          New Plan
        </button>
      </div>

      <div className="grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
        {/* Service navigation */}
        <aside>
          <div className="brand-card p-2">
            <div className="px-3 pb-3 pt-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
                Service Catalogue
              </p>
            </div>

            <div className="space-y-1">
              {filteredServices.map((service) => {
                const planCount =
                  service.pricing?.plans?.length || 0;

                const active =
                  activeService?.slug === service.slug;

                return (
                  <button
                    key={service.slug}
                    type="button"
                    onClick={() =>
                      setSelectedService(service)
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition",
                      active
                        ? "bg-brand-orange text-white"
                        : "text-surface-fg hover:bg-surface-muted/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        active
                          ? "bg-white/15"
                          : "bg-brand-orange/10 text-brand-orange"
                      )}
                    >
                      <Package className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {service.title}
                      </p>

                      <p
                        className={cn(
                          "mt-0.5 text-[0.65rem]",
                          active
                            ? "text-white/70"
                            : "text-surface-muted"
                        )}
                      >
                        {planCount}{" "}
                        {planCount === 1
                          ? "plan"
                          : "plans"}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="min-w-0">
          {/* Service overview */}
          <div className="brand-card mb-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-bold text-surface-fg">
                    {activeService?.title}
                  </h2>

                  <StatusBadge active />
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                  {activeService?.solution?.headline}
                </p>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-surface-border px-3.5 py-2 text-sm font-semibold text-surface-fg transition hover:bg-surface-muted/10"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Service
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat
                label="Plans"
                value={
                  activeService?.pricing?.plans
                    ?.length || 0
                }
              />

              <Stat
                label="Audiences"
                value={
                  activeService?.solution?.audiences
                    ?.length || 0
                }
              />

              <Stat
                label="Formats"
                value={
                  activeService?.solution?.formats
                    ?.length || 0
                }
              />
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-surface-fg">
                Pricing Plans
              </h3>

              <p className="mt-1 text-xs text-surface-muted">
                Plans currently available for this service.
              </p>
            </div>

            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search services..."
                className="brand-input w-full pl-9"
              />
            </div>
          </div>

          {/* Plans */}
          <div className="brand-card overflow-hidden p-0">
            {activeService?.pricing?.plans?.length ? (
              activeService.pricing.plans.map((plan) => (
                <PlanRow
                  key={plan.name}
                  plan={plan}
                  service={activeService}
                  onEdit={editPlan}
                  onDelete={deletePlan}
                  onDuplicate={duplicatePlan}
                />
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Package className="mx-auto h-8 w-8 text-surface-muted" />

                <h3 className="mt-3 font-display font-bold text-surface-fg">
                  No plans yet
                </h3>

                <p className="mt-1 text-sm text-surface-muted">
                  Create the first pricing plan for this
                  service.
                </p>

                <button
                  type="button"
                  onClick={createPlan}
                  className="mt-5 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Create Plan
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Plan editor */}
      {editor && (
        <PlanEditor
          service={editor.service}
          plan={editor.plan}
          onClose={() => setEditor(null)}
          onSave={savePlan}
        />
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-surface-border px-4 py-3">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
        {label}
      </p>

      <p className="mt-1 font-display text-xl font-bold text-surface-fg">
        {value}
      </p>
    </div>
  );
}