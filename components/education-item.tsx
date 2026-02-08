"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Education } from "@/lib/constants"

interface EducationItemProps {
  education: Education
  index?: number
  hasContent?: boolean
}

export function EducationItem({ education, index = 0, hasContent = false }: EducationItemProps) {
  const inner = (
    <>
      <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 block" aria-hidden="true" />
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{education.period}</span>
      <span className="flex items-start justify-between gap-2 mt-1">
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100 block">
          {education.degree}
        </span>
        {hasContent && (
          <ArrowUpRight size={14} className="text-gray-400 dark:text-gray-600 shrink-0 mt-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors" />
        )}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 block">{education.institution}</span>
      <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed block">{education.description}</span>
    </>
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
    >
      {hasContent ? (
        <Link href={`/education/${education.id}`} className="block group">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.article>
  )
}
