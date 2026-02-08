"use client"

import type { Project } from "@/data/projects"
import { FadeIn } from "@/components/motion-wrapper"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend,
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

const TEAL = "hsl(160, 70%, 45%)"
const GRAY = "hsl(0, 0%, 75%)"

interface SpeedupPayloadEntry {
  name: string
  value: number
  dataKey: string
  color: string
}

function SpeedupTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: SpeedupPayloadEntry[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-xs"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value}×
        </p>
      ))}
    </div>
  )
}

interface MemoryPayloadEntry {
  name: string
  value: number
  payload: { name: string; value: number }
}

function MemoryTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: MemoryPayloadEntry[]
}) {
  if (!active || !payload || payload.length === 0) return null

  const entry = payload[0]

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {entry.payload.name}
      </p>
      <p className="text-xs" style={{ color: entry.payload.name === "Flash-SAE" ? TEAL : GRAY }}>
        Memory: {entry.value}%
      </p>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FlashSAECharts({ project }: { project: Project }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FadeIn delay={0.2}>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Speedup vs PyTorch (×)
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={speedupData}
                margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  content={<SpeedupTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                />
                <ReferenceLine
                  y={1.0}
                  stroke="hsl(0, 0%, 60%)"
                  strokeDasharray="4 4"
                  label={{
                    value: "PyTorch baseline",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "hsl(0, 0%, 55%)",
                  }}
                />
                <Bar
                  dataKey="pytorch"
                  name="PyTorch"
                  fill={GRAY}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="flash"
                  name="Flash-SAE"
                  fill={TEAL}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Decoder Memory Usage (%)
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={memoryData}
                margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  domain={[0, 110]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  content={<MemoryTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                >
                  {memoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === "Flash-SAE" ? TEAL : GRAY}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
