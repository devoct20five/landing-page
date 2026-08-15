import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ROLES = [
  {
    id: "client",
    title: "Client",
    description:
      "Access your projects, tasks, files and approvals.",
    icon: UserRound,
  },
  {
    id: "staff",
    title: "Staff",
    description:
      "Manage projects, clients, tasks and internal operations.",
    icon: BriefcaseBusiness,
  },
];

export default function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleContinue = () => {
    if (!selectedRole) return;

    // Temporary frontend routing.
    // Replace with real authentication later.
    if (selectedRole === "client") {
      navigate("/dashboard");
    } else {
      navigate("/staff");
    }
  };

  return (
    <div className="theme-light min-h-screen bg-surface-bg">
      <div className="flex min-h-screen">
        {/* Left branding panel */}
        <div className="relative hidden w-[42%] overflow-hidden bg-brand-orange lg:flex">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full border-[80px] border-white" />
            <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full border-[100px] border-white" />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-display text-sm font-bold text-brand-orange">
                  O5
                </div>

                <div>
                  <p className="font-display text-lg font-bold tracking-[-0.02em] text-white">
                    OCT20FIVE
                  </p>

                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/65">
                    Creative Studio
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-md">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/65">
                Client & Staff Portal
              </p>

              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-white xl:text-5xl">
                Everything your work needs.
                <br />
                In one place.
              </h1>

              <p className="mt-6 max-w-sm text-sm leading-6 text-white/70">
                Projects, communication, approvals and
                everything in between — connected to the
                people doing the work.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck className="h-4 w-4" />
              Secure workspace access
            </div>
          </div>
        </div>

        {/* Login panel */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[480px]">
            {/* Mobile brand */}
            <div className="mb-12 lg:hidden">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange font-display text-xs font-bold text-white">
                  O5
                </div>

                <div>
                  <p className="font-display text-base font-bold text-surface-fg">
                    OCT20FIVE
                  </p>

                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                    Portal
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up">
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-orange">
                Welcome back
              </p>

              <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-surface-fg">
                Sign in to your portal
              </h2>

              <p className="mt-2 text-sm leading-6 text-surface-muted">
                Choose how you access OCT20FIVE before continuing.
              </p>

              {/* Role selection */}
              <div className="mt-8 space-y-3">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const active = selectedRole === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() =>
                        setSelectedRole(role.id)
                      }
                      className={cn(
                        "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                        active
                          ? "border-brand-orange bg-brand-orange/5 shadow-[0_8px_30px_-15px_rgba(255,90,31,0.5)]"
                          : "border-surface-border hover:border-brand-orange/40 hover:bg-surface-muted/5"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition",
                          active
                            ? "bg-brand-orange text-white"
                            : "bg-surface-muted/10 text-surface-muted group-hover:text-brand-orange"
                        )}
                      >
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={2}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-bold text-surface-fg">
                          {role.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-surface-muted">
                          {role.description}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
                          active
                            ? "bg-brand-orange text-white"
                            : "text-surface-muted opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Credentials */}
              {selectedRole && (
                <div className="mt-7 animate-fade-up">
                  <div className="mb-5 h-px bg-surface-border" />

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
                        Email Address
                      </label>

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@company.com"
                        className="brand-input w-full"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
                          Password
                        </label>

                        <button
                          type="button"
                          className="text-xs font-semibold text-brand-orange hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        className="brand-input w-full"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!email || !password}
                      className={cn(
                        "mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition",
                        email && password
                          ? "bg-brand-orange text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)] hover:brightness-105"
                          : "cursor-not-allowed bg-surface-muted/10 text-surface-muted"
                      )}
                    >
                      Sign in as{" "}
                      {selectedRole === "client"
                        ? "Client"
                        : "Staff"}

                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-8 text-center text-xs text-surface-muted">
                Need access?{" "}
                <button
                  type="button"
                  className="font-semibold text-brand-orange hover:underline"
                >
                  Contact OCT20FIVE
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}