"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-balance">
          Alessandro Potenza
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          Computer Engineering student at{" "}
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            Politecnico di Milano
          </span>
          , building high-performance AI systems, GPU kernels, and open-source tools.
        </p>
      </motion.div>
    </section>
  )
}
