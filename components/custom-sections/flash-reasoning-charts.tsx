"use client"

import type { Project } from "@/data/projects"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
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

const COLORS = {
  standard: "hsl(0, 0%, 75%)",
  flash: "hsl(220, 80%, 55%)",
}

interface ChartCardProps {
  title: string
  delay: number
  children: ReactNode
}

function ChartCard({ title, delay, children }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5"
    >
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        {title}
      </p>
      <div className="h-48">{children}</div>
    </motion.div>
  )
}

interface CustomTooltipPayloadEntry {
  name: string
  value: number
  payload: { name: string; value: number }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: CustomTooltipPayloadEntry[]
  unit: string
}

function CustomTooltip({ active, payload, unit }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const entry = payload[0]
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
        {entry.payload.name}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {entry.value}
        {unit}
      </p>
    </div>
  )
}

const AXIS_TICK_STYLE = { fontSize: 11, fill: "currentColor" }

export function FlashReasoningCharts({ project: _project }: { project: Project }) {
  const speedupData = [
    { name: "Standard Attn", value: 1.0 },
    { name: "Flash-Reasoning", value: 2.54 },
  ]

  const bandwidthData = [
    { name: "Standard Attn", value: 470 },
    { name: "Flash-Reasoning", value: 1194 },
  ]

  const vramData = [
    { name: "Standard", value: 100 },
    { name: "Flash-Reasoning", value: 3.4 },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ChartCard title="Attention Speedup (×)" delay={0.2}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={speedupData}>
            <XAxis
              dataKey="name"
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={{ stroke: "hsl(0, 0%, 75%)" }}
            />
            <YAxis
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={false}
              domain={[0, 3]}
            />
            <Tooltip
              content={<CustomTooltip unit="×" />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
            >
              {speedupData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={index === 0 ? COLORS.standard : COLORS.flash}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Effective Bandwidth (GB/s)" delay={0.3}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bandwidthData}>
            <XAxis
              dataKey="name"
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={{ stroke: "hsl(0, 0%, 75%)" }}
            />
            <YAxis
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={false}
              domain={[0, 1400]}
            />
            <Tooltip
              content={<CustomTooltip unit=" GB/s" />}
              cursor={{ fill: "transparent" }}
            />
            <ReferenceLine
              y={900}
              stroke="hsl(0, 75%, 55%)"
              strokeDasharray="6 4"
              label={{
                value: "HBM Limit (900 GB/s)",
                position: "right",
                fontSize: 10,
                fill: "hsl(0, 75%, 55%)",
              }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
            >
              {bandwidthData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={index === 0 ? COLORS.standard : COLORS.flash}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="VRAM Usage (%)" delay={0.4}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vramData}>
            <XAxis
              dataKey="name"
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={{ stroke: "hsl(0, 0%, 75%)" }}
            />
            <YAxis
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={false}
              domain={[0, 110]}
            />
            <Tooltip
              content={<CustomTooltip unit="%" />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
            >
              {vramData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={index === 0 ? COLORS.standard : COLORS.flash}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
