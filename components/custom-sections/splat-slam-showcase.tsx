"use client"

import { motion } from "framer-motion"
import { Camera, Crosshair, Map, Eye, GraduationCap, ExternalLink, Zap, Box, Cpu } from "lucide-react"
import type { Project } from "@/data/projects"

const PIPELINE_STEPS = [
  { label: "RGB Frame", description: "Standard monocular camera input", icon: Camera },
  { label: "Tracking", description: "Photometric pose estimation", icon: Crosshair },
  { label: "Mapping", description: "Keyframe selection & Gaussian optimization", icon: Map },
  { label: "Rendering", description: "Novel view synthesis", icon: Eye },
]

const KEY_FEATURES = [
  {
    icon: Camera,
    title: "No Depth Sensor",
    description: "Works with standard RGB video only — no LiDAR, stereo, or depth cameras needed",
  },
  {
    icon: Zap,
    title: "Real-time SLAM",
    description: "Simultaneous tracking and mapping at interactive frame rates",
  },
  {
    icon: Box,
    title: "3D Gaussian Splatting",
    description: "Photo-realistic rendering via differentiable Gaussian primitives, outperforming NeRF in speed",
  },
  {
    icon: Cpu,
    title: "Nerfstudio Extension",
    description: "Built as a modular plugin for the Nerfstudio framework, easily extensible",
  },
]

const DEMOS = [
  {
    title: "Room Scene",
    description: "Dense 3D reconstruction of an indoor room",
    video: "https://github.com/alessandro-potenza/Gaussian_Splatting_SLAM/assets/61759069/3873ef02-11ca-4fdb-bbb8-a02bf7c55339",
  },
  {
    title: "Kitchen Scene",
    description: "Complex environment with fine details",
    video: "https://github.com/alessandro-potenza/Gaussian_Splatting_SLAM/assets/61759069/efa44483-a665-41ca-8e2f-37018e24aff4",
  },
  {
    title: "Living Room",
    description: "Large-scale open environment",
    video: "https://github.com/alessandro-potenza/Gaussian_Splatting_SLAM/assets/61759069/91978c1e-f757-4e60-9f89-8a4325a594fb",
  },
]

export function SplatSLAMShowcase({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Pipeline visualization */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Real-time Pipeline
        </h4>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center text-center px-3 sm:px-4">
                <step.icon size={18} className="text-gray-500 dark:text-gray-400 mb-1.5" />
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {step.label}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 max-w-[120px]">
                  {step.description}
                </span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <span className="hidden sm:block text-gray-300 dark:text-gray-700 mx-1">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key features */}
      <div className="grid gap-4 sm:grid-cols-2">
        {KEY_FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shrink-0">
                <feature.icon size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Demo videos */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Demo Reconstructions
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {DEMOS.map((demo, i) => (
            <motion.div
              key={demo.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden"
            >
              <video
                src={demo.video}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full aspect-video bg-black"
              />
              <div className="p-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {demo.title}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {demo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Thesis card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 p-5">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 shrink-0">
            <GraduationCap
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Bachelor&apos;s Thesis
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              This project formed the foundation of my thesis at Sapienza
              University of Rome
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
