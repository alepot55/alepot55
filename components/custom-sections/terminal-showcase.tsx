"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/motion-wrapper"
import { ExternalLink, Package, Play, GitCompare, FileCode } from "lucide-react"
import type { Project } from "@/data/projects"

/* ── Data types ─────────────────────────────────────────────── */

type LineType = "command" | "pass" | "fail" | "warn" | "highlight" | "info" | "dim" | "blank" | "header" | "success"

interface TerminalLine {
  text: string
  type: LineType
}

/* ── Dual-theme color map (full static classes for Tailwind) ── */

const LINE_COLORS: Record<LineType, string> = {
  command: "text-gray-900 dark:text-white font-bold",
  pass: "text-green-600 dark:text-green-400",
  fail: "text-red-600 dark:text-red-400",
  warn: "text-amber-600 dark:text-yellow-400",
  highlight: "text-blue-600 dark:text-cyan-400",
  info: "text-gray-700 dark:text-gray-300",
  dim: "text-gray-400 dark:text-gray-600",
  blank: "",
  header: "text-blue-700 dark:text-cyan-300 font-bold",
  success: "text-green-700 dark:text-green-300 font-bold",
}

/* ── Progress bar component ─────────────────────────────────── */

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

const STATUS_TEXT: Record<string, string> = {
  PASS: "text-green-600 dark:text-green-400",
  WARN: "text-amber-600 dark:text-yellow-400",
  FAIL: "text-red-600 dark:text-red-400",
}

const STATUS_BAR: Record<string, string> = {
  PASS: "bg-green-500 dark:bg-green-400",
  WARN: "bg-amber-500 dark:bg-yellow-400",
  FAIL: "bg-red-500 dark:bg-red-400",
}

function ProgressBar({ bar, delay }: { bar: BarSpec; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-2 sm:gap-3 py-0.5"
    >
      <span className="w-28 sm:w-36 truncate text-gray-700 dark:text-gray-300 shrink-0">{bar.name}</span>
      <span className="w-12 text-right text-gray-400 dark:text-gray-600 shrink-0">{bar.cost}</span>
      <span className="w-10 text-right text-gray-400 dark:text-gray-600 shrink-0">{bar.time}</span>
      <div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden min-w-[80px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${bar.pct}%` }}
          transition={{ delay: delay + 0.1, duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${STATUS_BAR[bar.status]}`}
        />
      </div>
      <span className="w-10 text-right text-gray-400 dark:text-gray-600 shrink-0">{bar.pct}%</span>
      <span className={`w-10 text-right font-medium shrink-0 ${STATUS_TEXT[bar.status]}`}>{bar.status}</span>
    </motion.div>
  )
}

/* ── Tab 1: agentrial run ───────────────────────────────────── */

function RunTab() {
  return (
    <div className="space-y-1">
      <Line type="command" text="$ agentrial run tests/calculator_agent.yml --trials 25" delay={0} />
      <Blank />
      <Line type="highlight" text="agentrial v0.5.2 — calculator_agent" delay={0.05} />
      <Line type="dim" text="Model: claude-3.5-haiku · Parallel: 8 · Provider: auto-selected" delay={0.08} />
      <Blank />
      <div className="py-1 space-y-0.5">
        {RUN_BARS.map((bar, i) => (
          <ProgressBar key={bar.name} bar={bar} delay={0.12 + i * 0.08} />
        ))}
      </div>
      <Line type="fail" text="  → Step: output format mismatch  (Fisher p=0.027)" delay={0.55} />
      <Blank />
      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
      <Line type="header" text="Results" delay={0.6} />
      <Blank />
      <Line type="info" text="  Suites: 5 pass · 1 warn · 0 fail" delay={0.65} />
      <Line type="highlight" text="  Reliability: 94.0%  [83.5% — 98.7%]  (Wilson CI)" delay={0.7} />
      <Line type="dim" text="  Score: 87/100" delay={0.73} />
      <Blank />
      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
      <Line type="header" text="Cost Summary" delay={0.78} />
      <Blank />
      <Line type="info" text="  Total: $0.31  (25 trials)  ·  Avg: $0.012/trial" delay={0.82} />
      <Line type="info" text="  Duration: 8.2s parallel — est. 62s serial" delay={0.85} />
      <Blank />
      <Line type="pass" text="  ✓ Report saved to ./reports/calculator_agent_2026-02-08.html" delay={0.9} />
    </div>
  )
}

/* ── Tab 2: agentrial compare ───────────────────────────────── */

function CompareTab() {
  return (
    <div className="space-y-1">
      <Line type="command" text="$ agentrial compare react/v1.0.0.json react/v2.0.0.json" delay={0} />
      <Blank />
      <Line type="highlight" text="agentrial — version comparison" delay={0.05} />
      <Line type="dim" text="Baseline: v1.0.0 (2025-01-23)  →  Current: v2.0.0 (2026-01-15)" delay={0.08} />
      <Blank />
      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
      <Line type="header" text="Baseline Summary" delay={0.12} />
      <Blank />
      <Line type="info" text="  basic-math        95.0%  [87.1% — 98.6%]   UNCHANGED" delay={0.18} />
      <Line type="pass" text="  micro-step-color  98.0%  [93.0% — 99.8%]   IMPROVED ↑" delay={0.22} />
      <Line type="pass" text="    ↑ send-with-tool supported (broader in v2.0.0)" delay={0.25} />
      <Line type="info" text="  add-subtraction   97.0%  [91.5% — 99.4%]   UNCHANGED" delay={0.28} />
      <Line type="fail" text="  multi-digit       82.0%  [71.0% — 90.0%]   REGRESSION ↓" delay={0.32} />
      <Line type="fail" text="    ↓ regression caused by new tokenizer in v2.0.0" delay={0.35} />
      <Line type="info" text="  error-handling    96.0%  [88.8% — 99.2%]   UNCHANGED" delay={0.38} />
      <Blank />
      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
      <Line type="header" text="Drift Analysis" delay={0.42} />
      <Blank />
      <Line type="info" text="  Avg drift/trial:  30.005 ± 2ms  (low)" delay={0.46} />
      <Line type="pass" text="  Kolmogorov-Smirnov: p=0.847  (stable)" delay={0.49} />
      <Blank />
      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
      <Line type="header" text="Cost Analysis" delay={0.53} />
      <Blank />
      <Line type="warn" text="  Δ net: +1 improvement, 1 regression" delay={0.57} />
      <Line type="info" text="  Cost: $0.061  ·  Duration: 12.4s" delay={0.6} />
    </div>
  )
}

/* ── Tab 3: config YAML ─────────────────────────────────────── */

function ConfigTab() {
  const lines = [
    { text: "suite: calculator-eval", cls: "text-blue-600 dark:text-cyan-400" },
    { text: "agent: agents.calculator_agent.run", cls: "text-blue-600 dark:text-cyan-400" },
    { text: "provider: cheapest", cls: "text-gray-700 dark:text-gray-300" },
    { text: "temperature: 0.30", cls: "text-gray-700 dark:text-gray-300" },
    { text: "", cls: "" },
    { text: "cases:", cls: "text-amber-600 dark:text-yellow-400 font-medium" },
    { text: "  - name: basic-math", cls: "text-amber-600 dark:text-yellow-400" },
    { text: "    steps:", cls: "text-gray-700 dark:text-gray-300" },
    { text: "      - send_message:", cls: "text-gray-700 dark:text-gray-300" },
    { text: '          query: "What is 25 + 23?"', cls: "text-green-600 dark:text-green-400" },
    { text: "", cls: "" },
    { text: "      - check_response:", cls: "text-gray-700 dark:text-gray-300" },
    { text: '          must_contain: "48"', cls: "text-green-600 dark:text-green-400" },
    { text: "", cls: "" },
    { text: "  - name: edge-cases", cls: "text-amber-600 dark:text-yellow-400" },
    { text: "    steps:", cls: "text-gray-700 dark:text-gray-300" },
    { text: "      - send_message:", cls: "text-gray-700 dark:text-gray-300" },
    { text: '          query: "If a car travels 120km in 1.5h, speed in m/s?"', cls: "text-green-600 dark:text-green-400" },
    { text: "", cls: "" },
    { text: "      - check_response:", cls: "text-gray-700 dark:text-gray-300" },
    { text: '          must_contain_expression: "22.2"', cls: "text-green-600 dark:text-green-400" },
    { text: "", cls: "" },
    { text: "  - name: multi_chain", cls: "text-amber-600 dark:text-yellow-400" },
    { text: "    max_steps: 5", cls: "text-gray-700 dark:text-gray-300" },
    { text: "    steps:", cls: "text-gray-700 dark:text-gray-300" },
    { text: "      - send_message:", cls: "text-gray-700 dark:text-gray-300" },
    { text: '          query: "100 / 3, round to 3 digits"', cls: "text-green-600 dark:text-green-400" },
    { text: "", cls: "" },
    { text: "      - check_response:", cls: "text-gray-700 dark:text-gray-300" },
    { text: '          must_contain: "33.333"', cls: "text-green-600 dark:text-green-400" },
  ]

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 px-2 py-1 text-[10px] font-mono text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-bl">
        YAML
      </div>
      <div className="space-y-0">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.02 }}
          >
            {line.text === "" ? (
              <div className="h-4" />
            ) : (
              <div className="flex">
                <span className="w-6 text-right text-gray-300 dark:text-gray-700 select-none shrink-0 mr-3">
                  {i + 1}
                </span>
                <pre className={`whitespace-pre ${line.cls}`}>{line.text}</pre>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Shared line components ─────────────────────────────────── */

function Line({ type, text, delay }: { type: LineType; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <pre className={`whitespace-pre ${LINE_COLORS[type]}`}>{text}</pre>
    </motion.div>
  )
}

function Blank() {
  return <div className="h-3" />
}

/* ── Tab definitions ────────────────────────────────────────── */

interface Tab {
  id: string
  label: string
  icon: typeof Play
  filename: string
}

const TABS: Tab[] = [
  { id: "run", label: "Run", icon: Play, filename: "agentrial run" },
  { id: "compare", label: "Compare", icon: GitCompare, filename: "agentrial compare" },
  { id: "config", label: "Config", icon: FileCode, filename: "calculator_agent.yml" },
]

/* ── Ecosystem links ────────────────────────────────────────── */

const ECOSYSTEM_LINKS = [
  {
    title: "PyPI Package",
    subtitle: "pip install agentrial",
    href: "https://pypi.org/project/agentrial/",
    icon: Package,
  },
  {
    title: "VS Code Extension",
    subtitle: "Run trials from your editor",
    href: "https://marketplace.visualstudio.com/items?itemName=alepot55.agentrial-vscode",
    image: "https://alepot55.gallerycdn.vsassets.io/extensions/alepot55/agentrial-vscode/0.1.1/1770392406757/Microsoft.VisualStudio.Services.Icons.Default",
  },
  {
    title: "Product Hunt",
    subtitle: "Discover & upvote",
    href: "https://www.producthunt.com/products/github-268",
    icon: ExternalLink,
  },
]

/* ── Main component ─────────────────────────────────────────── */

export function TerminalShowcase({ project }: { project: Project }) {
  void project
  const [activeTab, setActiveTab] = useState("run")
  const activeTabData = TABS.find((t) => t.id === activeTab)!

  return (
    <FadeIn delay={0.2}>
      <div className="space-y-6">
        {/* Ecosystem links */}
        <div className="grid gap-4 sm:grid-cols-3">
          {ECOSYSTEM_LINKS.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shrink-0">
                {link.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={link.image} alt={link.title} width={20} height={20} className="rounded" />
                ) : link.icon ? (
                  <link.icon size={20} className="text-gray-500 dark:text-gray-400" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {link.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {link.subtitle}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Multi-tab terminal */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {/* Title bar */}
          <div className="bg-gray-100 dark:bg-gray-800/80">
            <div className="flex items-center gap-2 px-4 pt-3 pb-0">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80" />
              </div>
              <span className="ml-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                {activeTabData.filename}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex px-2 pt-2 gap-0.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
                  }`}
                >
                  <tab.icon size={12} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal body */}
          <div className="bg-white dark:bg-gray-950 p-4 sm:p-5 overflow-x-auto font-mono text-[12px] sm:text-[13px] leading-relaxed min-h-[380px]">
            {activeTab === "run" && <RunTab key="run" />}
            {activeTab === "compare" && <CompareTab key="compare" />}
            {activeTab === "config" && <ConfigTab key="config" />}
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
