"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Opacity only. Nothing on this site slides in: the one animation that carries
 * meaning is the measurement segment being drawn.
 */
export function FadeIn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
