"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AgentResponse,
  RiskTolerance,
  runEarningsAgent,
} from "@/lib/agent";

const RISK_OPTIONS: { label: string; value: RiskTolerance }[] = [
  { label: "Low - prefer predictable returns", value: "low" },
  { label: "Medium - balanced risk & upside", value: "medium" },
  { label: "High - comfortable with volatility", value: "high" },
];

const ASSET_OPTIONS = [
  "Newsletter",
  "Audience",
  "Automation tools",
  "Consulting case studies",
  "Design portfolio",
  "Codebase",
  "Capital access",
  "Sales scripts",
];

const PREFERENCE_OPTIONS = [
  "service",
  "product",
  "automation",
  "saas",
  "content",
];

interface FormState {
  goal: string;
  skills: string;
  timePerWeek: number;
  availableCapital: number;
  riskTolerance: RiskTolerance;
  selectedAssets: string[];
  selectedPreferences: string[];
}

export default function Home() {
  const [form, setForm] = useState<FormState>({
    goal: "",
    skills: "",
    timePerWeek: 12,
    availableCapital: 300,
    riskTolerance: "medium",
    selectedAssets: [],
    selectedPreferences: ["service"],
  });
  const [result, setResult] = useState<AgentResponse | null>(null);

  const projectedAnnual = useMemo(() => {
    if (!result) return 0;
    const monthlySum = result.strategies.reduce(
      (sum, strategy) => sum + strategy.projectedMonthlyRevenue,
      0
    );
    return monthlySum * 12;
  }, [result]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const agentResult = runEarningsAgent({
      goal: form.goal,
      skills: form.skills.split(",").map((skill) => skill.trim()),
      timePerWeek: Number(form.timePerWeek),
      availableCapital: Number(form.availableCapital),
      riskTolerance: form.riskTolerance,
      assets: form.selectedAssets,
      preferences: form.selectedPreferences,
    });
    setResult(agentResult);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 lg:flex-row lg:py-16">
        <aside className="w-full rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-slate-900/40 backdrop-blur lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[22rem] lg:p-8">
          <header className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
              Yield Agent
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">
              Build a profit engine that compounds every week.
            </h1>
            <p className="mt-4 text-sm text-slate-400">
              Feed the agent with your advantages and it returns a
              commercialization blueprint that can start producing cash within 30
              days.
            </p>
          </header>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">
                Target outcome
              </label>
              <textarea
                className="min-h-[96px] rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                placeholder="Ex: Replace my salary and build a $5k/month service business."
                value={form.goal}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, goal: event.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">
                Skills (comma separated)
              </label>
              <input
                className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                placeholder="Copywriting, automation, sales enablement"
                value={form.skills}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, skills: event.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-200">
                  Hours per week
                </label>
                <input
                  type="number"
                  min={0}
                  className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  value={form.timePerWeek}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      timePerWeek: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-200">
                  Available capital ($)
                </label>
                <input
                  type="number"
                  min={0}
                  className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  value={form.availableCapital}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      availableCapital: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">
                Risk profile
              </label>
              <div className="flex flex-col gap-2">
                {RISK_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                      form.riskTolerance === option.value
                        ? "border-emerald-400/80 bg-emerald-500/10"
                        : "border-slate-700 bg-slate-900/60 hover:border-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="risk"
                      className="mt-1 accent-emerald-400"
                      value={option.value}
                      checked={form.riskTolerance === option.value}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          riskTolerance: option.value,
                        }))
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">
                Assets you can leverage
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ASSET_OPTIONS.map((asset) => {
                  const active = form.selectedAssets.includes(asset);
                  return (
                    <button
                      type="button"
                      key={asset}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          selectedAssets: active
                            ? prev.selectedAssets.filter((item) => item !== asset)
                            : [...prev.selectedAssets, asset],
                        }))
                      }
                      className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-wide transition ${
                        active
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                          : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {asset}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">
                What energizes you?
              </label>
              <div className="flex flex-wrap gap-2">
                {PREFERENCE_OPTIONS.map((preference) => {
                  const active = form.selectedPreferences.includes(preference);
                  return (
                    <button
                      type="button"
                      key={preference}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          selectedPreferences: active
                            ? prev.selectedPreferences.filter(
                                (item) => item !== preference
                              )
                            : [...prev.selectedPreferences, preference],
                        }))
                      }
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition ${
                        active
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                          : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {preference}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
            >
              Generate profit blueprint
            </button>
          </form>
        </aside>

        <main className="flex-1 space-y-8">
          {!result ? (
            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center shadow-lg shadow-slate-900/30">
              <div className="mx-auto max-w-lg space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  The agent is ready.
                </h2>
                <p className="text-sm text-slate-400">
                  Describe your goals, strengths, and the resources you have
                  today. The output is a multi-track monetization plan with
                  timelines, metrics, and reinvestment loops designed to help you
                  earn faster.
                </p>
              </div>
            </section>
          ) : (
            <>
              <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 shadow-lg shadow-emerald-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Profit Signal
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {result.headline}
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
                    <p className="text-xs uppercase tracking-wide text-emerald-200">
                      Projected monthly stack
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-100">
                      $
                      {result.strategies
                        .reduce(
                          (sum, strategy) =>
                            sum + strategy.projectedMonthlyRevenue,
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
                    <p className="text-xs uppercase tracking-wide text-emerald-200">
                      12-month upside
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-100">
                      ${projectedAnnual.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
                    <p className="text-xs uppercase tracking-wide text-emerald-200">
                      Quick win actions
                    </p>
                    <ul className="mt-2 space-y-2 text-left text-sm text-emerald-100">
                      {result.quickWins.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-3">
                {result.strategies.map((strategy) => (
                  <article
                    key={strategy.id}
                    className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/40"
                  >
                    <header className="mb-4 space-y-2">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        {strategy.riskLevel.toUpperCase()} RISK
                      </p>
                      <h3 className="text-xl font-semibold text-white">
                        {strategy.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {strategy.description}
                      </p>
                    </header>
                    <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-300">
                      <span className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-1">
                        Startup cost: ${strategy.startupCost.toLocaleString()}
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-1">
                        Timeline: {strategy.timelineWeeks} weeks
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-1">
                        Monthly: ${strategy.projectedMonthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-slate-300">
                      {strategy.rationale}
                    </p>
                    <div className="mt-6 space-y-4">
                      {strategy.actions.map((action) => (
                        <div
                          key={action.label}
                          className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                        >
                          <p className="text-sm font-semibold text-white">
                            {action.label}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            {action.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Leverage plays
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        {strategy.leveragePoints.map((point) => (
                          <li key={point}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Reinvestment
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {strategy.reinvestment}
                      </p>
                    </div>
                  </article>
                ))}
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/40">
                  <h3 className="text-lg font-semibold text-white">
                    90-day execution timeline
                  </h3>
                  <div className="mt-5 space-y-4">
                    {result.timeline.map((item) => (
                      <div
                        key={item.week}
                        className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                      >
                        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                          <span>{item.week}</span>
                          <span>{item.focus}</span>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                          {item.deliverables.map((deliverable) => (
                            <li key={deliverable}>• {deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/40">
                  <h3 className="text-lg font-semibold text-white">
                    Scoreboard that compounds
                  </h3>
                  <div className="mt-5 space-y-4">
                    {result.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                      >
                        <p className="text-sm font-semibold text-white">
                          {metric.label}
                        </p>
                        <p className="mt-1 text-sm text-emerald-200">
                          {metric.target}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {metric.whyItMatters}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/40">
                <h3 className="text-lg font-semibold text-white">
                  Reinvestment flywheel
                </h3>
                <p className="mt-3 text-sm text-slate-400">
                  Roll profit into higher leverage moves as soon as traction is
                  validated.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {result.reinvestments.map((idea, index) => (
                    <div
                      key={idea}
                      className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Step {index + 1}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">{idea}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
