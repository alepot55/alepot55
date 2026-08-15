"use client"

import { useState } from "react"
import type { Project } from "@/data/projects"

/* ── Line semantics ─────────────────────────────────────────────
   command : what was typed, the prompt itself stays secondary
   head    : section heading inside the output
   out     : normal output and measured results, including successes
   meta    : configuration echo, provenance, secondary detail
   fail    : a failure or a threshold that was not met
   There is no success colour: a result that holds is simply --ink. */

type LineType = "command" | "head" | "out" | "meta" | "fail"

const LINE_CLASS: Record<LineType, string> = {
  command: "text-ink",
  head: "text-ink font-medium",
  out: "text-ink",
  meta: "text-ref",
  fail: "text-accent",
}

function Line({ type, text }: { type: LineType; text: string }) {
  if (type === "command") {
    return (
      <div className="whitespace-pre text-ink">
        <span className="text-ref">$ </span>
        {text}
      </div>
    )
  }
  return <div className={`whitespace-pre ${LINE_CLASS[type]}`}>{text}</div>
}

function Blank() {
  return <div className="h-3" aria-hidden="true" />
}

/* ── Per suite results ──────────────────────────────────────────
   pct is the measured pass rate of the suite, so the filled length
   is real: --ink on a --rail track, no animation, no gradient. */

interface BarSpec {
  name: string
  cost: string
  time: string
  pct: number
  status: "PASS" | "WARN" | "FAIL"
}

const RUN_BARS: BarSpec[] = [
  { name: "basic-math", cost: "$0.08", time: "0.25s", pct: 100, status: "PASS" },
  { name: "micro-step-color", cost: "$0.06", time: "0.18s", pct: 100, status: "PASS" },
  { name: "add-subtraction", cost: "$0.06", time: "0.26s", pct: 100, status: "PASS" },
  { name: "multi-digit", cost: "$0.07", time: "0.30s", pct: 60, status: "WARN" },
  { name: "error-handling", cost: "$0.05", time: "0.19s", pct: 80, status: "PASS" },
]

function ResultRow({ bar }: { bar: BarSpec }) {
  const missed = bar.status !== "PASS"

  return (
    <div className="flex items-center gap-2 py-0.5 sm:gap-3">
      <span className="w-28 shrink-0 truncate text-ink sm:w-36">{bar.name}</span>
      <span className="w-12 shrink-0 text-right text-ref tnum">{bar.cost}</span>
      <span className="w-10 shrink-0 text-right text-ref tnum">{bar.time}</span>
      <div className="h-1.5 min-w-[80px] flex-1 rounded-sm bg-rail" aria-hidden="true">
        <div className="h-full rounded-sm bg-ink" style={{ width: `${bar.pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-ref tnum">{bar.pct}%</span>
      <span className={`w-10 shrink-0 text-right ${missed ? "text-accent" : "text-ink"}`}>
        {bar.status}
      </span>
    </div>
  )
}

/* ── Tab 1: agentrial run ───────────────────────────────────── */

function RunTab() {
  return (
    <div className="min-w-[320px] space-y-1">
      <Line type="command" text="agentrial run tests/calculator_agent.yml --trials 25" />
      <Blank />
      <Line type="out" text="agentrial v0.5.2 · calculator_agent" />
      <Line type="meta" text="Model: claude-3.5-haiku · Parallel: 8 · Provider: auto-selected" />
      <Blank />
      <div className="space-y-0.5 py-1">
        {RUN_BARS.map((bar) => (
          <ResultRow key={bar.name} bar={bar} />
        ))}
      </div>
      <Line type="fail" text="  multi-digit: output format mismatch (Fisher p=0.027)" />
      <Blank />
      <Line type="head" text="Results" />
      <Blank />
      <Line type="out" text="  Suites: 4 pass · 1 warn · 0 fail" />
      <Line type="out" text="  Reliability: 94.0%  [83.5%, 98.7%]  (Wilson CI)" />
      <Line type="out" text="  Score: 87/100" />
      <Blank />
      <Line type="head" text="Cost summary" />
      <Blank />
      <Line type="out" text="  Total: $0.31  (25 trials)  ·  Avg: $0.012/trial" />
      <Line type="out" text="  Duration: 8.2s parallel  ·  est. 62s serial" />
      <Blank />
      <Line type="out" text="  Report saved to ./reports/calculator_agent_2026-02-08.html" />
    </div>
  )
}

/* ── Tab 2: agentrial compare ───────────────────────────────── */

function CompareTab() {
  return (
    <div className="min-w-[320px] space-y-1">
      <Line type="command" text="agentrial compare react/v1.0.0.json react/v2.0.0.json" />
      <Blank />
      <Line type="out" text="agentrial · version comparison" />
      <Line type="meta" text="Baseline: v1.0.0 (2025-01-23)  ->  Current: v2.0.0 (2026-01-15)" />
      <Blank />
      <Line type="head" text="Baseline summary" />
      <Blank />
      <Line type="out" text="  basic-math        95.0%  [87.1%, 98.6%]   UNCHANGED" />
      <Line type="out" text="  micro-step-color  98.0%  [93.0%, 99.8%]   IMPROVED" />
      <Line type="meta" text="    send-with-tool supported (broader in v2.0.0)" />
      <Line type="out" text="  add-subtraction   97.0%  [91.5%, 99.4%]   UNCHANGED" />
      <Line type="fail" text="  multi-digit       82.0%  [71.0%, 90.0%]   REGRESSION" />
      <Line type="fail" text="    caused by the new tokenizer in v2.0.0" />
      <Line type="out" text="  error-handling    96.0%  [88.8%, 99.2%]   UNCHANGED" />
      <Blank />
      <Line type="head" text="Drift analysis" />
      <Blank />
      <Line type="out" text="  Avg drift/trial: 30.005 ± 2ms  (low)" />
      <Line type="out" text="  Kolmogorov-Smirnov: p=0.847  (stable)" />
      <Blank />
      <Line type="head" text="Cost analysis" />
      <Blank />
      <Line type="out" text="  Net: +1 improvement, 1 regression" />
      <Line type="out" text="  Cost: $0.061  ·  Duration: 12.4s" />
    </div>
  )
}

/* ── Tab 3: config YAML ─────────────────────────────────────── */

const CONFIG_LINES = [
  "suite: calculator-eval",
  "agent: agents.calculator_agent.run",
  "provider: cheapest",
  "temperature: 0.30",
  "",
  "cases:",
  "  - name: basic-math",
  "    steps:",
  "      - send_message:",
  '          query: "What is 25 + 23?"',
  "",
  "      - check_response:",
  '          must_contain: "48"',
  "",
  "  - name: edge-cases",
  "    steps:",
  "      - send_message:",
  '          query: "If a car travels 120km in 1.5h, speed in m/s?"',
  "",
  "      - check_response:",
  '          must_contain_expression: "22.2"',
  "",
  "  - name: multi_chain",
  "    max_steps: 5",
  "    steps:",
  "      - send_message:",
  '          query: "100 / 3, round to 3 digits"',
  "",
  "      - check_response:",
  '          must_contain: "33.333"',
]

function ConfigTab() {
  return (
    <div className="min-w-[320px]">
      {CONFIG_LINES.map((text, i) =>
        text === "" ? (
          <div key={i} className="h-4" aria-hidden="true" />
        ) : (
          <div key={i} className="flex">
            <span className="mr-3 w-6 shrink-0 select-none text-right text-ref tnum">{i + 1}</span>
            <span className="whitespace-pre text-ink">{text}</span>
          </div>
        )
      )}
    </div>
  )
}

/* ── Tab definitions ────────────────────────────────────────── */

interface Tab {
  id: string
  label: string
  filename: string
}

const TABS: Tab[] = [
  { id: "run", label: "run", filename: "agentrial run" },
  { id: "compare", label: "compare", filename: "agentrial compare" },
  { id: "config", label: "config", filename: "calculator_agent.yml" },
]

/* ── Ecosystem links ────────────────────────────────────────── */

const ECOSYSTEM_LINKS = [
  {
    title: "PyPI package",
    subtitle: "pip install agentrial",
    href: "https://pypi.org/project/agentrial/",
  },
  {
    title: "VS Code extension",
    subtitle: "Run trials from your editor",
    href: "https://marketplace.visualstudio.com/items?itemName=alepot55.agentrial-vscode",
  },
  {
    title: "Product Hunt",
    subtitle: "Discover and upvote",
    href: "https://www.producthunt.com/products/github-268",
  },
]

/* ── Main component ─────────────────────────────────────────── */

export function TerminalShowcase({ project }: { project: Project }) {
  void project
  const [activeTab, setActiveTab] = useState("run")
  const activeTabData = TABS.find((t) => t.id === activeTab)!

  return (
    <>
      <div className="space-y-8">
        {/* Where the tool actually lives */}
        <ul className="flex flex-wrap gap-x-10 gap-y-2" role="list">
          {ECOSYSTEM_LINKS.map((link) => (
            <li key={link.title}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[44px] flex-col justify-center"
              >
                <span className="font-mono text-nav text-ref underline decoration-rail underline-offset-4 transition-colors group-hover:text-ink group-hover:decoration-accent">
                  {link.title}
                </span>
                <span className="mt-1 font-mono text-meta text-ref">{link.subtitle}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Multi-tab terminal: same surface as every other frame on the site */}
        <div className="rounded border border-rail bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-x-6 px-3 sm:px-4">
            <div className="flex gap-2" role="tablist" aria-label="agentrial output">
              {TABS.map((tab) => {
                const active = tab.id === activeTab
                return (
                  <button
                    key={tab.id}
                    id={`terminal-tab-${tab.id}`}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    aria-controls={`terminal-panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex min-h-[44px] min-w-[44px] items-center justify-center px-2 font-mono text-nav transition-colors ${
                      active ? "text-ink" : "text-ref hover:text-ink"
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <span
                        className="absolute inset-x-1 bottom-2 h-px bg-accent"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
            <span className="font-mono text-meta text-ref">{activeTabData.filename}</span>
          </div>

          <div
            id={`terminal-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`terminal-tab-${activeTab}`}
            tabIndex={0}
            className="min-h-[380px] overflow-x-auto px-3 pb-5 pt-1 font-mono text-unit leading-relaxed sm:px-4"
          >
            {activeTab === "run" && <RunTab />}
            {activeTab === "compare" && <CompareTab />}
            {activeTab === "config" && <ConfigTab />}
          </div>
        </div>
      </div>
    </>
  )
}
