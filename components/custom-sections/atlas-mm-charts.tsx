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
} from "recharts"

/**
 * Recharts overwrites the className it is handed on axis ticks, so the colour
 * arrives as currentColor (the frame carries `text-ref`) and the mono face as
 * an inline style. Bars and cells keep their classes.
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

function ChartFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded border border-rail bg-surface p-4 text-ref">
      <p className="font-mono text-meta text-ref tnum">{title}</p>
      <div className="mt-3 h-48">{children}</div>
    </div>
  )
}

const VERIFICATION_RESULTS = [
  { property: "No crossed book", time: "2.2ms" },
  { property: "A-S spread always positive", time: "5.7ms" },
  { property: "A-S inventory mean-reversion", time: "2.1ms" },
  { property: "Price-time priority", time: "0.4ms" },
]

export function AtlasMMCharts({ project: _project }: { project: Project }) {
  const inventoryData = [
    { name: "A-S", value: 7.19 },
    { name: "RL (PPO)", value: 22.4 },
    { name: "Random", value: 40.97 },
  ]

  const drawdownData = [
    { name: "A-S", value: 2.99 },
    { name: "RL (PPO)", value: 19.23 },
  ]

  const fillRateData = [
    { name: "A-S", value: 5.68 },
    { name: "RL (PPO)", value: 28.48 },
  ]

  return (
    <div className="space-y-8">
      {/* A-S is the measured strategy, every other agent is a reference point */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ChartFrame title="Inventory std, lower is better">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData}>
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
                domain={[0, 45]}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={TOOLTIP_CONTENT}
                labelStyle={TOOLTIP_LABEL}
                itemStyle={TOOLTIP_ITEM}
                formatter={(value) => `${value}`}
              />
              <Bar
                dataKey="value"
                name="inventory std"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
                isAnimationActive={false}
              >
                {inventoryData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    className={index === 0 ? "chart-ink" : "chart-ref"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Max drawdown, lower is better">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={drawdownData}>
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
                domain={[0, 22]}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={TOOLTIP_CONTENT}
                labelStyle={TOOLTIP_LABEL}
                itemStyle={TOOLTIP_ITEM}
                formatter={(value) => `${value}`}
              />
              <Bar
                dataKey="value"
                name="max drawdown"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
                isAnimationActive={false}
              >
                {drawdownData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    className={index === 0 ? "chart-ink" : "chart-ref"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Fill rate (%)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fillRateData}>
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
                domain={[0, 35]}
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
                name="fill rate"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
                isAnimationActive={false}
              >
                {fillRateData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    className={index === 0 ? "chart-ink" : "chart-ref"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      {/* Formal verification results */}
      <div>
        <p className="font-mono text-meta text-ref">
          Z3 formal verification: all four properties proved, with solver time
        </p>
        <ul className="mt-3 space-y-2">
          {VERIFICATION_RESULTS.map((result) => (
            <li
              key={result.property}
              className="flex items-baseline justify-between gap-4"
            >
              <span className="font-mono text-meta text-ink">{result.property}</span>
              <span className="font-mono text-meta text-ref tnum">{result.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
