"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts"
import { FadeIn } from "@/components/motion-wrapper"
import type { Project } from "@/data/projects"

const CUDA_COLOR = "hsl(142, 60%, 45%)"
const TRITON_COLOR = "hsl(0, 65%, 55%)"
const NGAP_COLOR = "hsl(142, 60%, 45%)"
const BASIC_COLOR = "hsl(220, 70%, 55%)"
const CSR_COLOR = "hsl(30, 80%, 55%)"
const BITGEN_COLOR = "hsl(0, 65%, 55%)"

// Figure 3 data: CUDA vs Triton best kernel time per test (sorted by slowdown)
const CUDA_VS_TRITON = [
  { name: "hamming", cuda: 0.0045, triton: 0.1483, slowdown: 32.8 },
  { name: "spm_bible", cuda: 0.0032, triton: 0.0623, slowdown: 19.4 },
  { name: "protomata", cuda: 0.0034, triton: 0.0616, slowdown: 18.4 },
  { name: "bro217", cuda: 0.0033, triton: 0.0489, slowdown: 14.9 },
  { name: "entity_res", cuda: 0.0034, triton: 0.0385, slowdown: 11.3 },
  { name: "brill_1mb", cuda: 0.0032, triton: 0.0342, slowdown: 10.8 },
  { name: "ranges05", cuda: 0.0032, triton: 0.0323, slowdown: 10.2 },
  { name: "clamav", cuda: 0.0032, triton: 0.0324, slowdown: 10.1 },
  { name: "yara", cuda: 0.0033, triton: 0.0331, slowdown: 10.1 },
  { name: "brill_10mb", cuda: 0.0034, triton: 0.0325, slowdown: 9.6 },
  { name: "fermi", cuda: 0.0047, triton: 0.0350, slowdown: 7.4 },
  { name: "filecarving", cuda: 0.0044, triton: 0.0312, slowdown: 7.0 },
  { name: "apprng", cuda: 0.0043, triton: 0.0268, slowdown: 6.2 },
]

// NGAP win rate: 1/13
const NGAP_WINRATE = [
  { name: "NGAP Wins", value: 1 },
  { name: "NGAP Loses", value: 12 },
]

// Summary statistics: median kernel time per technique
const TECHNIQUE_SUMMARY = [
  { name: "Basic", value: 0.0037, impl: "cuda" },
  { name: "CSR", value: 0.0046, impl: "cuda" },
  { name: "NGAP v2", value: 0.0060, impl: "cuda" },
  { name: "BitGen", value: 0.1359, impl: "cuda" },
  { name: "NFA_DFS", value: 0.0342, impl: "triton" },
  { name: "TABLE_CSR", value: 0.5640, impl: "triton" },
  { name: "BITMAP_VEC", value: 11.07, impl: "triton" },
]

// Slowdown factors for key benchmarks
const SLOWDOWN_DATA = [
  { name: "hamming", value: 32.8 },
  { name: "spm_bible", value: 19.4 },
  { name: "protomata", value: 18.4 },
  { name: "bro217", value: 14.9 },
  { name: "entity_res", value: 11.3 },
  { name: "brill_1mb", value: 10.8 },
  { name: "ranges05", value: 10.2 },
  { name: "clamav", value: 10.1 },
  { name: "yara", value: 10.1 },
  { name: "brill_10mb", value: 9.6 },
  { name: "fermi", value: 7.4 },
  { name: "filecarving", value: 7.0 },
  { name: "apprng", value: 6.2 },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" ? entry.value < 1 ? entry.value.toFixed(4) : entry.value.toFixed(1) : entry.value}
          {entry.name === "slowdown" ? "×" : " ms"}
        </p>
      ))}
    </div>
  )
}

function SlowdownTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
      <p className="text-red-500">{payload[0].value.toFixed(1)}× slower</p>
    </div>
  )
}

function TechniqueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
      <p className="text-gray-500">{d.impl === "cuda" ? "CUDA" : "Triton"}: {d.value < 1 ? d.value.toFixed(4) : d.value.toFixed(2)} ms</p>
    </div>
  )
}

export function GPUCharts({ project }: { project: Project }) {
  void project

  return (
    <div className="space-y-6">
      {/* Chart 1: CUDA vs Triton kernel time per benchmark */}
      <FadeIn delay={0.2}>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            CUDA vs Triton — Best Kernel Time per Benchmark
          </h4>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
            13 FSA benchmarks, log scale (ms). Lower is faster.
          </p>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CUDA_VS_TRITON} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: "hsl(0,0%,50%)", fontSize: 9 }} tickLine={false} angle={-35} textAnchor="end" height={50} />
                <YAxis scale="log" domain={["auto", "auto"]} tick={{ fill: "hsl(0,0%,50%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(0,0%,90%,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="cuda" name="CUDA" fill={CUDA_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} animationDuration={800} />
                <Bar dataKey="triton" name="Triton" fill={TRITON_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 2: Triton Slowdown Factor */}
        <FadeIn delay={0.3}>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Triton Slowdown Factor
            </h4>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
              How many times slower Triton is vs CUDA per benchmark
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SLOWDOWN_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: "hsl(0,0%,50%)", fontSize: 9 }} tickLine={false} angle={-35} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: "hsl(0,0%,50%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<SlowdownTooltip />} cursor={{ fill: "hsl(0,0%,90%,0.1)" }} />
                  <ReferenceLine y={10.2} stroke="hsl(0,0%,60%)" strokeDasharray="4 4" label={{ value: "Median 10.2×", position: "insideTopRight", fill: "hsl(0,0%,55%)", fontSize: 10 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28} animationDuration={800}>
                    {SLOWDOWN_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.value > 15 ? "hsl(0, 70%, 50%)" : entry.value > 10 ? "hsl(30, 80%, 55%)" : "hsl(45, 80%, 50%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        {/* Chart 3: Technique Summary */}
        <FadeIn delay={0.4}>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Median Kernel Time by Technique
            </h4>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
              All CUDA and Triton techniques (ms, log scale)
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TECHNIQUE_SUMMARY} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: "hsl(0,0%,50%)", fontSize: 9 }} tickLine={false} angle={-25} textAnchor="end" height={45} />
                  <YAxis scale="log" domain={["auto", "auto"]} tick={{ fill: "hsl(0,0%,50%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TechniqueTooltip />} cursor={{ fill: "hsl(0,0%,90%,0.1)" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36} animationDuration={800}>
                    {TECHNIQUE_SUMMARY.map((entry, i) => (
                      <Cell key={i} fill={entry.impl === "cuda" ? CUDA_COLOR : TRITON_COLOR} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Key findings */}
      <FadeIn delay={0.5}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Median Slowdown", value: "10.2×", desc: "Triton vs CUDA" },
            { label: "NGAP Win Rate", value: "1/13", desc: "Only pathological case" },
            { label: "Worst Case", value: "32.8×", desc: "hamming benchmark" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{stat.desc}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  )
}
