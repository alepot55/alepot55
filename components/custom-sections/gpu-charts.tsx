"use client"

import type { ReactNode } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"
import type { Project } from "@/data/projects"

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

const KEY_FINDINGS = [
  { label: "Median slowdown", value: "10.2×", desc: "Triton vs CUDA" },
  { label: "NGAP win rate", value: "1/13", desc: "only pathological case" },
  { label: "Worst case", value: "32.8×", desc: "hamming benchmark" },
]

/**
 * Recharts overwrites the className it is handed on axis ticks, so the colour
 * arrives as currentColor (the frame carries `text-ref`) and the mono face as
 * an inline style. Bars, cells, reference lines and labels keep their classes.
 */
const AXIS_TICK = {
  className: "chart-ref",
  fill: "currentColor",
  fontSize: 11,
  style: { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" },
}

const TOOLTIP_CONTENT = {
  background: "hsl(var(--surface))",
  border: "1px solid hsl(var(--rail))",
  borderRadius: "4px",
  padding: "6px 9px",
  boxShadow: "none",
  fontFamily: "var(--font-mono)",
  fontSize: "0.6875rem",
  fontVariantNumeric: "tabular-nums",
}
const TOOLTIP_LABEL = { color: "hsl(var(--ink))" }
const TOOLTIP_ITEM = { color: "hsl(var(--ref))" }

function formatMs(value: number) {
  return value < 1 ? value.toFixed(4) : value.toFixed(2)
}

function ChartFrame({
  title,
  caption,
  keys,
  height,
  children,
}: {
  title: string
  caption: string
  keys?: { label: string; tone: "ref" | "ink" }[]
  height: string
  children: ReactNode
}) {
  return (
    <div className="rounded border border-rail bg-surface p-4 text-ref">
      <h4 className="font-mono text-meta text-ref tnum">{title}</h4>
      <p className="mt-0.5 font-mono text-meta text-ref tnum">{caption}</p>
      {keys && (
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-meta text-ref">
          {keys.map((k) => (
            <span key={k.label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-sm ${k.tone === "ink" ? "bg-ink" : "bg-ref"}`}
              />
              {k.label}
            </span>
          ))}
        </div>
      )}
      <div className={`mt-3 ${height}`}>{children}</div>
    </div>
  )
}

export function GPUCharts({ project }: { project: Project }) {
  void project

  return (
    <div className="space-y-6">
      {/* Chart 1: CUDA vs Triton kernel time per benchmark */}
      <ChartFrame
        title="CUDA vs Triton, best kernel time per benchmark"
        caption="13 FSA benchmarks, log scale (ms). Lower is faster."
        keys={[
          { label: "CUDA", tone: "ref" },
          { label: "Triton", tone: "ink" },
        ]}
        height="h-64 sm:h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CUDA_VS_TRITON} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ className: "chart-ref-stroke" }}
              angle={-35}
              textAnchor="end"
              height={58}
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={TOOLTIP_CONTENT}
              labelStyle={TOOLTIP_LABEL}
              itemStyle={TOOLTIP_ITEM}
              formatter={(value) => `${formatMs(Number(value))} ms`}
            />
            <Bar
              dataKey="cuda"
              name="CUDA"
              className="chart-ref"
              radius={[2, 2, 0, 0]}
              maxBarSize={24}
              animationDuration={800}
            />
            <Bar
              dataKey="triton"
              name="Triton"
              className="chart-ink"
              radius={[2, 2, 0, 0]}
              maxBarSize={24}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 2: Triton slowdown factor */}
        <ChartFrame
          title="Triton slowdown factor"
          caption="How many times slower Triton is than CUDA, per benchmark. Dashed line: median 10.2×."
          height="h-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SLOWDOWN_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ className: "chart-ref-stroke" }}
                angle={-35}
                textAnchor="end"
                height={58}
              />
              <YAxis
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={TOOLTIP_CONTENT}
                labelStyle={TOOLTIP_LABEL}
                itemStyle={TOOLTIP_ITEM}
                formatter={(value) => `${Number(value).toFixed(1)}× slower`}
              />
              <ReferenceLine
                y={10.2}
                className="chart-ref-stroke text-ref"
                stroke="currentColor"
                strokeDasharray="4 4"
              />
              <Bar
                dataKey="value"
                name="slowdown"
                className="chart-ink"
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        {/* Chart 3: median kernel time by technique */}
        <ChartFrame
          title="Median kernel time by technique"
          caption="All CUDA and Triton techniques (ms, log scale)"
          keys={[
            { label: "CUDA", tone: "ref" },
            { label: "Triton", tone: "ink" },
          ]}
          height="h-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TECHNIQUE_SUMMARY} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ className: "chart-ref-stroke" }}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                scale="log"
                domain={["auto", "auto"]}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={TOOLTIP_CONTENT}
                labelStyle={TOOLTIP_LABEL}
                itemStyle={TOOLTIP_ITEM}
                formatter={(value, _name, item) => {
                  const impl = (item?.payload as { impl?: string } | undefined)?.impl
                  return [
                    `${formatMs(Number(value))} ms`,
                    impl === "cuda" ? "CUDA" : "Triton",
                  ]
                }}
              />
              <Bar
                dataKey="value"
                name="median"
                radius={[2, 2, 0, 0]}
                maxBarSize={36}
                animationDuration={800}
              >
                {TECHNIQUE_SUMMARY.map((entry) => (
                  <Cell
                    key={entry.name}
                    className={entry.impl === "cuda" ? "chart-ref" : "chart-ink"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      {/* Key findings */}
      <div className="grid gap-6 sm:grid-cols-3">
        {KEY_FINDINGS.map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-value-m font-semibold tracking-snug text-ink tnum">
              {stat.value}
            </p>
            <p className="mt-1.5 font-mono text-meta text-ref">{stat.label}</p>
            <p className="font-mono text-meta text-ref tnum">{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
