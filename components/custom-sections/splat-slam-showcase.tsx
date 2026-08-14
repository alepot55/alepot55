"use client"

import { Camera, Crosshair, Map, Eye, ArrowRight } from "lucide-react"
import type { Project } from "@/data/projects"

const PIPELINE_STEPS = [
  { label: "RGB Frame", description: "Standard monocular camera input", icon: Camera },
  { label: "Tracking", description: "Photometric pose estimation", icon: Crosshair },
  { label: "Mapping", description: "Keyframe selection and Gaussian optimization", icon: Map },
  { label: "Rendering", description: "Novel view synthesis", icon: Eye },
]

const KEY_FEATURES = [
  {
    title: "No Depth Sensor",
    description:
      "Works with standard RGB video only: no LiDAR, stereo, or depth cameras needed",
  },
  {
    title: "Real-time SLAM",
    description: "Simultaneous tracking and mapping at interactive frame rates",
  },
  {
    title: "3D Gaussian Splatting",
    description:
      "Photo-realistic rendering via differentiable Gaussian primitives, outperforming NeRF in speed",
  },
  {
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
    <div className="space-y-10">
      {/* Pipeline diagram: a diagram frame is a sanctioned surface */}
      <div className="rounded border border-rail bg-surface p-5 sm:p-6">
        <p className="font-mono text-meta text-ref">Real-time pipeline</p>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0 sm:justify-between">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center sm:flex-1">
              <div className="flex w-full flex-col items-start text-left sm:items-center sm:text-center">
                <step.icon className="h-4 w-4 text-ink" aria-hidden="true" />
                <span className="mt-1.5 font-mono text-meta text-ink">{step.label}</span>
                <span className="mt-0.5 max-w-[140px] font-mono text-meta text-ref">
                  {step.description}
                </span>
              </div>

              {i < PIPELINE_STEPS.length - 1 && (
                <ArrowRight
                  className="mx-1 hidden h-4 w-4 shrink-0 self-center text-ref sm:block"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key features */}
      <div className="grid gap-6 sm:grid-cols-2">
        {KEY_FEATURES.map((feature) => (
          <div key={feature.title}>
            <h4 className="font-mono text-unit text-ink">{feature.title}</h4>
            <p className="mt-1 max-w-measure text-body text-ref">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Demo videos */}
      <div>
        <p className="font-mono text-meta text-ref">Demo reconstructions</p>
        <div className="mt-3 grid gap-5 sm:grid-cols-3">
          {DEMOS.map((demo) => (
            <div key={demo.title}>
              <div className="overflow-hidden rounded border border-rail bg-surface">
                <video
                  src={demo.video}
                  controls
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full"
                />
              </div>
              <h5 className="mt-2 font-mono text-meta text-ink">{demo.title}</h5>
              <p className="mt-0.5 text-body text-ref">{demo.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Thesis note */}
      <div>
        <p className="font-mono text-meta text-ref">Bachelor&apos;s thesis</p>
        <p className="mt-1 max-w-measure text-body text-ink">
          This project formed the foundation of my thesis at Sapienza University of Rome.
        </p>
      </div>
    </div>
  )
}
