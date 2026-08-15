"use client"

import type { Project } from "@/data/projects"
import type { ReactNode } from "react"
import {
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  CartesianGrid,
  Cell,
} from "recharts"

/**
 * Recharts overwrites the className it is handed on axis ticks, so the colour
 * arrives as currentColor (the frame carries `text-ref`) and the mono face as
 * an inline style. Series, cells and labels take currentColor too, because
 * recharts puts className on the wrapping layer and the presentation attribute
 * on the shape itself.
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

// Representative IT_NORD winter weekday: overnight trough, morning ramp,
// midday solar depression, evening peak. price = point forecast (EUR/MWh),
// lo/hi = ~80% prediction interval (ties to the [0.78, 0.82] coverage gate).
const FORECAST = [
  { hour: 0, price: 98, lo: 89, hi: 107 },
  { hour: 1, price: 92, lo: 84, hi: 100 },
  { hour: 2, price: 88, lo: 80, hi: 96 },
  { hour: 3, price: 85, lo: 78, hi: 93 },
  { hour: 4, price: 84, lo: 76, hi: 92 },
  { hour: 5, price: 88, lo: 80, hi: 97 },
  { hour: 6, price: 102, lo: 92, hi: 113 },
  { hour: 7, price: 124, lo: 111, hi: 138 },
  { hour: 8, price: 138, lo: 123, hi: 154 },
  { hour: 9, price: 132, lo: 118, hi: 147 },
  { hour: 10, price: 122, lo: 109, hi: 135 },
  { hour: 11, price: 115, lo: 103, hi: 128 },
  { hour: 12, price: 108, lo: 96, hi: 120 },
  { hour: 13, price: 104, lo: 92, hi: 116 },
  { hour: 14, price: 106, lo: 94, hi: 118 },
  { hour: 15, price: 112, lo: 100, hi: 125 },
  { hour: 16, price: 124, lo: 110, hi: 139 },
  { hour: 17, price: 142, lo: 126, hi: 159 },
  { hour: 18, price: 158, lo: 140, hi: 177 },
  { hour: 19, price: 166, lo: 147, hi: 186 },
  { hour: 20, price: 160, lo: 142, hi: 179 },
  { hour: 21, price: 144, lo: 128, hi: 161 },
  { hour: 22, price: 126, lo: 112, hi: 141 },
  { hour: 23, price: 110, lo: 98, hi: 123 },
].map((d) => ({ ...d, base: d.lo, band: d.hi - d.lo }))

const BUY = FORECAST[4] // overnight trough
const SELL = FORECAST[19] // evening peak

const RMAE = [
  { name: "LightGBM", value: 0.52 },
  { name: "Naive (168h)", value: 1.0 },
]

const ZONES = ["NORD", "CNOR", "CSUD", "SUD", "CALA", "SICI", "SARD"]

const COVERAGE = [
  { value: "7", label: "zones" },
  { value: "168h", label: "horizon" },
  { value: "1h", label: "resolution" },
]

const formatHour = (h: number) => `${String(h).padStart(2, "0")}:00`

type Tone = "ink" | "ref" | "band" | "accent"

const TONE_SWATCH: Record<Tone, string> = {
  ink: "bg-ink",
  ref: "bg-ref",
  band: "bg-ink/[0.16]",
  accent: "bg-accent",
}

function ChartFrame({
  title,
  caption,
  keys,
  children,
}: {
  title: string
  caption?: string
  keys?: { label: string; tone: Tone }[]
  children: ReactNode
}) {
  return (
    <div className="rounded border border-rail bg-surface p-4 text-ref">
      <h4 className="font-mono text-meta text-ref tnum">{title}</h4>
      {caption && (
        <p className="mt-0.5 font-mono text-meta text-ref tnum">{caption}</p>
      )}
      {keys && (
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-meta text-ref">
          {keys.map((k) => (
            <span key={k.label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-sm ${TONE_SWATCH[k.tone]}`}
              />
              {k.label}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3">{children}</div>
    </div>
  )
}

interface ForecastTooltipProps {
  active?: boolean
  payload?: { payload: (typeof FORECAST)[number] }[]
}

function ForecastTooltip({ active, payload }: ForecastTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const d = payload[0].payload
  return (
    <div className="rounded border border-rail bg-surface px-2.5 py-1.5 font-mono text-meta">
      <p className="text-ink tnum">{formatHour(d.hour)}</p>
      <p className="text-ref tnum">{d.price} EUR/MWh</p>
      <p className="text-ref tnum">
        80% interval: {d.lo} to {d.hi}
      </p>
    </div>
  )
}

export function EnergyForecastCharts({ project: _project }: { project: Project }) {
  return (
    <div className="space-y-6">
      {/* Day-ahead forecast curve with prediction band and buy/sell signals */}
      <ChartFrame
        title="Day-ahead forecast, IT_NORD"
        caption="Representative session: point forecast, 80% prediction interval, threshold signals."
        keys={[
          { label: "Point forecast", tone: "ink" },
          { label: "80% interval", tone: "band" },
          { label: "Threshold crossed", tone: "accent" },
        ]}
      >
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={FORECAST}
              margin={{ top: 12, right: 8, bottom: 4, left: -12 }}
            >
              <CartesianGrid
                vertical={false}
                className="text-rail"
                stroke="currentColor"
              />
              <XAxis
                dataKey="hour"
                ticks={[0, 4, 8, 12, 16, 20]}
                tickFormatter={formatHour}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ className: "chart-ref-stroke" }}
              />
              <YAxis
                domain={[60, 200]}
                ticks={[60, 100, 140, 180]}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                content={<ForecastTooltip />}
                cursor={{
                  className: "text-rail",
                  stroke: "currentColor",
                  strokeDasharray: "3 3",
                }}
              />
              {/* invisible base lifts the band to the lower bound */}
              <Area
                dataKey="base"
                stackId="pi"
                stroke="none"
                fill="none"
                isAnimationActive={false}
              />
              {/* visible band = hi - lo, stacked on the base */}
              <Area
                dataKey="band"
                stackId="pi"
                className="text-ink"
                stroke="none"
                fill="currentColor"
                fillOpacity={0.16}
                animationDuration={800}
              />
              <Line
                dataKey="price"
                className="text-ink"
                stroke="currentColor"
                strokeWidth={2}
                dot={false}
                animationDuration={900}
              />
              <ReferenceDot
                x={BUY.hour}
                y={BUY.price}
                r={4}
                className="text-accent"
                fill="currentColor"
                strokeWidth={0}
                label={{
                  value: "Buy",
                  position: "bottom",
                  fontSize: 11,
                  fill: "currentColor",
                  style: { fontFamily: "var(--font-mono)" },
                }}
              />
              <ReferenceDot
                x={SELL.hour}
                y={SELL.price}
                r={4}
                className="text-accent"
                fill="currentColor"
                strokeWidth={0}
                label={{
                  value: "Sell",
                  position: "top",
                  fontSize: 11,
                  fill: "currentColor",
                  style: { fontFamily: "var(--font-mono)" },
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartFrame>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* rMAE vs weekly naive */}
        <ChartFrame
          title="rMAE vs weekly naive, lower is better"
          caption="Synthetic development set, real ENTSO-E backfill pending API token."
          keys={[
            { label: "Model", tone: "ink" },
            { label: "Naive baseline", tone: "ref" },
          ]}
        >
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={RMAE}
                margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
              >
                <XAxis
                  dataKey="name"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={{ className: "chart-ref-stroke" }}
                />
                <YAxis
                  domain={[0, 1.1]}
                  ticks={[0, 0.5, 1.0]}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={TOOLTIP_CONTENT}
                  labelStyle={TOOLTIP_LABEL}
                  itemStyle={TOOLTIP_ITEM}
                  formatter={(value) => [Number(value).toFixed(2), "rMAE"]}
                />
                <Bar
                  dataKey="value"
                  name="rMAE"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={70}
                  animationDuration={800}
                >
                  {RMAE.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      className={index === 0 ? "chart-ink" : "chart-ref"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartFrame>

        {/* Zonal coverage */}
        <ChartFrame
          title="Zonal coverage"
          caption="Day-ahead market (GME/IPEX) after the PUN was retired in 2025."
        >
          <div className="flex flex-wrap gap-2">
            {ZONES.map((zone) => (
              <span
                key={zone}
                className="rounded border border-rail bg-bg px-2 py-1 font-mono text-meta text-ref"
              >
                {zone}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-rail pt-4">
            {COVERAGE.map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-value-s font-semibold tracking-snug text-ink tnum">
                  {stat.value}
                </p>
                <p className="mt-1.5 font-mono text-meta text-ref">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ChartFrame>
      </div>
    </div>
  )
}
