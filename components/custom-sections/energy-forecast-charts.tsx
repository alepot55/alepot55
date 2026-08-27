"use client"

import type { ReactNode } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import type { Project } from "@/data/projects"

/**
 * Real numbers, not synthetic. Source: the project's own REPORT_FINAL section
 * 4bis.5, backfill and retrain over real ENTSO-E history 2022-01-01 to
 * 2026-04-16, single holdout on the last 60 days, all seven zones.
 */
const BY_ZONE = [
  { zone: "NORD", rmae: 0.349, mae: 7.434 },
  { zone: "CNOR", rmae: 0.351, mae: 7.589 },
  { zone: "CSUD", rmae: 0.392, mae: 8.992 },
  { zone: "SUD", rmae: 0.345, mae: 8.941 },
  { zone: "CALA", rmae: 0.342, mae: 8.834 },
  { zone: "SICI", rmae: 0.345, mae: 10.496 },
  { zone: "SARD", rmae: 0.363, mae: 10.276 },
]

const KEY_FINDINGS = [
  {
    value: "0.34-0.39",
    label: "rMAE, every zone",
    desc: "roughly a third of the naive error",
  },
  {
    value: "7.4-10.5",
    label: "MAE, EUR/MWh",
    desc: "islands cost the most per hour",
  },
  {
    value: "0.57",
    label: "worst monthly fold",
    desc: "SARD, November, still under 1",
  },
]

/**
 * Recharts overwrites the className it is handed on axis ticks, so the colour
 * arrives as currentColor (the frame carries `text-ref`) and the mono face as
 * an inline style. Bars, reference lines and labels keep their classes.
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
  caption,
  height,
  children,
}: {
  title: string
  caption: string
  height: string
  children: ReactNode
}) {
  return (
    <div className="rounded border border-rail bg-surface p-4 text-ref">
      <h4 className="font-mono text-meta text-ref tnum">{title}</h4>
      <p className="mt-0.5 font-mono text-meta text-ref tnum">{caption}</p>
      <div className={`mt-3 ${height}`}>{children}</div>
    </div>
  )
}

export function EnergyForecastCharts({ project }: { project: Project }) {
  void project

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFrame
          title="Forecast error against the weekly naive"
          caption="rMAE per zone. The line at 1.00 is the naive itself: lower is better."
          height="h-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BY_ZONE} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="zone"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ className: "chart-ref-stroke" }}
              />
              <YAxis
                domain={[0, 1.1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={TOOLTIP_CONTENT}
                labelStyle={TOOLTIP_LABEL}
                itemStyle={TOOLTIP_ITEM}
                formatter={(value) => [`rMAE ${Number(value).toFixed(3)}`, "measured"]}
              />
              <ReferenceLine
                y={1}
                className="chart-ref-stroke text-ref"
                stroke="currentColor"
                strokeDasharray="4 4"
              />
              <Bar
                dataKey="rmae"
                name="rMAE"
                className="chart-ink"
                radius={[2, 2, 0, 0]}
                maxBarSize={32}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame
          title="Absolute error per zone"
          caption="MAE in EUR/MWh. Relative skill is flat, the euro cost is not."
          height="h-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BY_ZONE} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="zone"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ className: "chart-ref-stroke" }}
              />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={TOOLTIP_CONTENT}
                labelStyle={TOOLTIP_LABEL}
                itemStyle={TOOLTIP_ITEM}
                formatter={(value) => [`${Number(value).toFixed(2)} EUR/MWh`, "MAE"]}
              />
              <Bar
                dataKey="mae"
                name="MAE"
                className="chart-ref"
                radius={[2, 2, 0, 0]}
                maxBarSize={32}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

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

      <p className="max-w-measure border-t border-rail pt-4 font-mono text-meta text-ref">
        Measured on real ENTSO-E history, 2022-01-01 to 2026-04-16, with the last 60 days held out.
        rMAE divides the model MAE by the MAE of the weekly naive forecast (the price 168 hours
        earlier), so a value under 1 means the model beats it. Across six monthly walk-forward folds
        no zone ever crossed 0.6. These are holdout numbers: the model has not yet been validated
        live in shadow mode.
      </p>
    </div>
  )
}
