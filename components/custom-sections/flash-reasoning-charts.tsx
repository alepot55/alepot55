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
  limitNote,
  children,
}: {
  title: string
  limitNote?: string
  children: ReactNode
}) {
  return (
    <div className="rounded border border-rail bg-surface p-4 text-ref">
      <p className="font-mono text-meta text-ref tnum">{title}</p>
      {limitNote && (
        <p className="font-mono text-meta text-accent tnum">{limitNote}</p>
      )}
      <div className="mt-3 h-48">{children}</div>
    </div>
  )
}

export function FlashReasoningCharts({ project: _project }: { project: Project }) {
  const speedupData = [
    { name: "Standard", value: 1.0 },
    { name: "Flash-Reasoning", value: 2.54 },
  ]

  const bandwidthData = [
    { name: "Standard", value: 470 },
    { name: "Flash-Reasoning", value: 1194 },
  ]

  const vramData = [
    { name: "Standard", value: 100 },
    { name: "Flash-Reasoning", value: 3.4 },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ChartFrame title="Attention speedup (×)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={speedupData}>
            <XAxis
              dataKey="name"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ className: "chart-ref-stroke" }}
              interval={0}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={[0, 3]}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={TOOLTIP_CONTENT}
              labelStyle={TOOLTIP_LABEL}
              itemStyle={TOOLTIP_ITEM}
              formatter={(value) => `${value}×`}
            />
            <Bar
              dataKey="value"
              name="speedup"
              radius={[2, 2, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
            >
              {speedupData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  className={index === 0 ? "chart-ref" : "chart-ink"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame
        title="Effective bandwidth (GB/s)"
        limitNote="Dashed line: HBM peak 900"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bandwidthData}>
            <XAxis
              dataKey="name"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ className: "chart-ref-stroke" }}
              interval={0}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={[0, 1400]}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={TOOLTIP_CONTENT}
              labelStyle={TOOLTIP_LABEL}
              itemStyle={TOOLTIP_ITEM}
              formatter={(value) => `${value} GB/s`}
            />
            <ReferenceLine
              y={900}
              className="chart-accent-stroke text-accent"
              stroke="currentColor"
              strokeDasharray="4 4"
            />
            <Bar
              dataKey="value"
              name="bandwidth"
              radius={[2, 2, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
            >
              {bandwidthData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  className={index === 0 ? "chart-ref" : "chart-ink"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="VRAM usage (%)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vramData}>
            <XAxis
              dataKey="name"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ className: "chart-ref-stroke" }}
              interval={0}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={[0, 110]}
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
              name="VRAM"
              radius={[2, 2, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
            >
              {vramData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  className={index === 0 ? "chart-ref" : "chart-ink"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  )
}
