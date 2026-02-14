"use client"

import type { Project } from "@/data/projects"
import type { ReactNode } from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, CheckCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const COLORS = {
  as: "hsl(220, 80%, 55%)",
  rl: "hsl(0, 0%, 75%)",
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

const VERIFICATION_RESULTS = [
  { property: "No crossed book", time: "2.2ms" },
  { property: "A-S spread always positive", time: "5.7ms" },
  { property: "A-S inventory mean-reversion", time: "2.1ms" },
  { property: "Price-time priority", time: "0.4ms" },
]

export function AtlasMMCharts({ project: _project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

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
    <div className="space-y-4">
      {/* Charts grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Inventory Std (lower = better)" delay={0.2}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData}>
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
                domain={[0, 45]}
              />
              <Tooltip
                content={<CustomTooltip unit="" />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
                animationDuration={800}
              >
                {inventoryData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={index === 0 ? COLORS.as : COLORS.rl}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Max Drawdown (lower = better)" delay={0.3}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={drawdownData}>
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
                domain={[0, 22]}
              />
              <Tooltip
                content={<CustomTooltip unit="" />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
                animationDuration={800}
              >
                {drawdownData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={index === 0 ? COLORS.as : COLORS.rl}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fill Rate (%)" delay={0.4}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fillRateData}>
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
                domain={[0, 35]}
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
                {fillRateData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={index === 0 ? COLORS.as : COLORS.rl}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Formal verification results */}
      <div ref={ref} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Z3 Formal Verification
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {VERIFICATION_RESULTS.map((result, i) => (
            <motion.div
              key={result.property}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20 px-4 py-3"
            >
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {result.property}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Shield className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                <span className="text-xs font-mono text-green-600 dark:text-green-400">
                  {result.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
