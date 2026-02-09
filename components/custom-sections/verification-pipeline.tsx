"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  FileCode,
  GitBranch,
  Network,
  Brain,
  Code2,
  Shield,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowDown,
} from "lucide-react"
import type { Project } from "@/data/projects"

const PIPELINE_STEPS = [
  {
    label: "COBOL Source",
    icon: FileCode,
    color: "border-blue-400 dark:border-blue-500",
    iconColor: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    label: "Parser",
    icon: GitBranch,
    color: "border-violet-400 dark:border-violet-500",
    iconColor: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    label: "IR Expression Tree",
    icon: Network,
    color: "border-teal-400 dark:border-teal-500",
    iconColor: "text-teal-500 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
  },
  {
    label: "LLM Translation",
    icon: Brain,
    color: "border-amber-400 dark:border-amber-500",
    iconColor: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    label: "Java BigDecimal",
    icon: Code2,
    color: "border-orange-400 dark:border-orange-500",
    iconColor: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    label: "Z3 Solver",
    icon: Shield,
    color: "border-indigo-400 dark:border-indigo-500",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
] as const

export function VerificationPipeline({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const totalStepDuration = PIPELINE_STEPS.length * 0.15
  const arrowsAfterLastStep = totalStepDuration + 0.15
  const outcomesDelay = arrowsAfterLastStep + 0.3

  return (
    <div className="space-y-8">
      {/* Pipeline visualization */}
      <div
        ref={ref}
        className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6"
      >
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
          Verification Pipeline
        </p>

        {/* Desktop layout: horizontal */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-1">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="contents">
                  {/* Step box */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.15,
                      ease: "easeOut",
                    }}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 ${step.color} ${step.bg} px-3 py-4 flex-1 h-[80px]`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${step.iconColor}`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                      {step.label}
                    </span>
                  </motion.div>

                  {/* Connecting arrow (not after the last step) */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.15 + 0.1,
                        ease: "easeOut",
                      }}
                      className="flex items-center origin-left flex-shrink-0"
                    >
                      <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Outcome branches (desktop) */}
          <div className="flex justify-center gap-8 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: outcomesDelay,
                ease: "easeOut",
              }}
              className="flex items-center gap-2 rounded-lg border-2 border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-950/30 px-4 py-3"
            >
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                Verified
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: outcomesDelay + 0.1,
                ease: "easeOut",
              }}
              className="flex items-center gap-2 rounded-lg border-2 border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-3"
            >
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                Drift Detected
              </span>
              <RotateCcw className="h-4 w-4 text-red-400 dark:text-red-500" />
            </motion.div>
          </div>
        </div>

        {/* Mobile layout: vertical */}
        <div className="lg:hidden">
          <div className="flex flex-col items-center gap-1">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="flex flex-col items-center">
                  {/* Step box */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.15,
                      ease: "easeOut",
                    }}
                    className={`flex items-center gap-3 rounded-lg border-2 ${step.color} ${step.bg} px-4 py-3 w-full max-w-[240px]`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${step.iconColor}`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {step.label}
                    </span>
                  </motion.div>

                  {/* Vertical connector (not after the last step) */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.15 + 0.1,
                        ease: "easeOut",
                      }}
                      className="flex items-center justify-center py-0.5 origin-top"
                    >
                      <ArrowDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Outcome branches (mobile) */}
          <div className="flex flex-col items-center gap-3 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: outcomesDelay,
                ease: "easeOut",
              }}
              className="flex items-center gap-2 rounded-lg border-2 border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-950/30 px-4 py-3 w-full max-w-[240px]"
            >
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                Verified
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: outcomesDelay + 0.1,
                ease: "easeOut",
              }}
              className="flex items-center gap-2 rounded-lg border-2 border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-3 w-full max-w-[240px]"
            >
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                Drift Detected
              </span>
              <RotateCcw className="h-4 w-4 text-red-400 dark:text-red-500" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* YouTube demo embed */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Demo
        </p>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden aspect-video">
          <iframe
            src="https://www.youtube.com/embed/2Tv3cGaI6PM"
            title={`${project.title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
