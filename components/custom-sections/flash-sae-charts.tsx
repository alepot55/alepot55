"use client"

import type { Project } from "@/data/projects"
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

const speedupData = [
  { name: "Encoder", pytorch: 1.0, flash: 1.06 },
  { name: "Decoder", pytorch: 1.0, flash: 13.6 },
  { name: "Full Forward", pytorch: 1.0, flash: 1.78 },
]

const memoryData = [
  { name: "Standard PyTorch", value: 100 },
  { name: "Flash-SAE", value: 3 },
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

function ChartFrame({
  title,
  note,
  keys,
  children,
}: {
  title: string
  note?: string
  keys?: { label: string; tone: "ref" | "ink" }[]
  children: ReactNode
}) {
  return (
    <div className="rounded border border-rail bg-surface p-4 text-ref">
      <p className="font-mono text-meta text-ref tnum">{title}</p>
      {note && <p className="font-mono text-meta text-ref tnum">{note}</p>}
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
      <div className="mt-3 h-56">{children}</div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FlashSAECharts({ project }: { project: Project }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartFrame
        title="Speedup vs PyTorch (×)"
        note="Dashed line: PyTorch baseline at 1×"
        keys={[
          { label: "PyTorch", tone: "ref" },
          { label: "Flash-SAE", tone: "ink" },
        ]}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={speedupData}
            margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
          >
            <XAxis
              dataKey="name"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ className: "chart-ref-stroke" }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={TOOLTIP_CONTENT}
              labelStyle={TOOLTIP_LABEL}
              itemStyle={TOOLTIP_ITEM}
              formatter={(value) => `${value}×`}
            />
            <ReferenceLine
              y={1.0}
              className="chart-ref-stroke text-ref"
              stroke="currentColor"
              strokeDasharray="4 4"
            />
            <Bar
              dataKey="pytorch"
              name="PyTorch"
              className="chart-ref"
              radius={[2, 2, 0, 0]}
              maxBarSize={50}
              isAnimationActive={false}
            />
            <Bar
              dataKey="flash"
              name="Flash-SAE"
              className="chart-ink"
              radius={[2, 2, 0, 0]}
              maxBarSize={50}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="Decoder memory usage (%)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={memoryData}
            margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
          >
            <XAxis
              dataKey="name"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ className: "chart-ref-stroke" }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              domain={[0, 110]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={TOOLTIP_CONTENT}
              labelStyle={TOOLTIP_LABEL}
              itemStyle={TOOLTIP_ITEM}
              formatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="value"
              name="memory"
              radius={[2, 2, 0, 0]}
              maxBarSize={50}
              isAnimationActive={false}
            >
              {memoryData.map((entry) => (
                <Cell
                  key={entry.name}
                  className={entry.name === "Flash-SAE" ? "chart-ink" : "chart-ref"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  )
}
