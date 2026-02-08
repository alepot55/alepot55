"use client"

import { motion } from "framer-motion"
import { SKILL_CATEGORY_COLORS } from "@/lib/constants"
import type { SkillCategory } from "@/data/skills"

interface SkillsChartProps {
  skills: Record<string, SkillCategory>
}

export function SkillsChart({ skills }: SkillsChartProps) {
  return (
    <div className="space-y-4" role="list" aria-label="Skills by category">
      {Object.entries(skills).map(([category, { items, level }], catIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: catIndex * 0.08 }}
          role="listitem"
        >
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">
              {category}
            </span>
            <div
              className="flex-1 relative h-8 bg-gray-100 dark:bg-gray-800/80 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={level}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${category}: ${items.join(", ")}`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${level}%` }}
                transition={{ duration: 0.6, delay: 0.3 + catIndex * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                className={`absolute inset-y-0 left-0 rounded-full ${SKILL_CATEGORY_COLORS[category] || "bg-gray-500/80"}`}
              />
              <div className="absolute inset-0 flex items-center px-3.5">
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate relative z-10">
                  {items.join(" · ")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
