"use client"

import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import type { Project } from "@/data/projects"

const GENRES = [
  "Blues",
  "Classical",
  "Country",
  "Disco",
  "HipHop",
  "Jazz",
  "Metal",
  "Pop",
  "Reggae",
  "Rock",
] as const

const CONFUSION_MATRIX: number[][] = [
  [82, 2, 4, 1, 0, 5, 0, 2, 3, 1], // Blues
  [1, 95, 0, 0, 0, 2, 1, 1, 0, 0], // Classical
  [3, 0, 78, 2, 1, 1, 0, 5, 4, 6], // Country
  [1, 0, 2, 80, 5, 0, 2, 4, 3, 3], // Disco
  [0, 0, 1, 4, 85, 1, 3, 2, 2, 2], // HipHop
  [4, 3, 1, 0, 0, 88, 0, 1, 2, 1], // Jazz
  [0, 1, 0, 2, 2, 0, 90, 1, 1, 3], // Metal
  [1, 1, 4, 5, 2, 1, 1, 78, 3, 4], // Pop
  [2, 0, 3, 3, 2, 2, 1, 3, 80, 4], // Reggae
  [2, 0, 5, 4, 3, 1, 4, 4, 3, 74], // Rock
]

export function ConfusionMatrixViz({ project }: { project: Project }) {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  void project

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5"
    >
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Classification Confusion Matrix
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Rows: actual genre, Columns: predicted genre
      </p>

      <div ref={containerRef} className="relative flex justify-center" onMouseMove={handleMouseMove}>
        <div
          className="grid gap-[2px] w-full max-w-lg"
          style={{
            gridTemplateColumns: "60px repeat(10, 1fr)",
            gridTemplateRows: "48px repeat(10, 1fr)",
            minWidth: "400px",
          }}
        >
          {/* Top-left empty corner */}
          <div />

          {/* Column headers */}
          {GENRES.map((genre, colIdx) => (
            <div
              key={`col-${genre}`}
              className="flex items-end justify-center pb-1 relative"
            >
              <span
                className={`text-[10px] font-medium truncate origin-bottom-left whitespace-nowrap transition-colors duration-150 ${
                  hoveredCell?.col === colIdx
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                style={{
                  transform: "rotate(-45deg)",
                  transformOrigin: "center bottom",
                  display: "inline-block",
                }}
              >
                {genre}
              </span>
            </div>
          ))}

          {/* Data rows with row headers */}
          {CONFUSION_MATRIX.map((row, rowIdx) => (
            <React.Fragment key={`row-${GENRES[rowIdx]}`}>
              {/* Row header */}
              <div className="flex items-center justify-end pr-2">
                <span
                  className={`text-[10px] font-medium truncate transition-colors duration-150 ${
                    hoveredCell?.row === rowIdx
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {GENRES[rowIdx]}
                </span>
              </div>

              {/* Data cells */}
              {row.map((value, colIdx) => {
                const isDiagonal = rowIdx === colIdx
                const isHovered =
                  hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx
                const opacity = Math.max(0.05, value / 100)

                return (
                  <div
                    key={`cell-${rowIdx}-${colIdx}`}
                    className="relative flex items-center justify-center aspect-square cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredCell({ row: rowIdx, col: colIdx })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                      transition: "transform 150ms ease",
                      zIndex: isHovered ? 10 : 1,
                    }}
                  >
                    {/* Background color layer */}
                    <div
                      className="absolute inset-0 rounded-sm bg-blue-500 dark:bg-blue-400"
                      style={{ opacity }}
                    />

                    {/* Diagonal highlight ring */}
                    {isDiagonal && (
                      <div className="absolute inset-0 rounded-sm ring-1 ring-inset ring-blue-600/30 dark:ring-blue-300/30" />
                    )}

                    {/* Hover outline */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-sm ring-2 ring-blue-500 dark:ring-blue-400" />
                    )}

                    {/* Value text */}
                    <span
                      className={`relative text-[10px] font-medium leading-none ${
                        value > 50
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Floating tooltip — positioned relative to container, outside the grid */}
        {hoveredCell && (
          <div
            className="absolute z-50 px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs whitespace-nowrap shadow-xl pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 12,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="font-medium">
              {GENRES[hoveredCell.row]} → {GENRES[hoveredCell.col]}
            </div>
            <div className="text-gray-300 dark:text-gray-600">
              {CONFUSION_MATRIX[hoveredCell.row][hoveredCell.col]}%{" "}
              {hoveredCell.row === hoveredCell.col ? "(correct)" : "misclassified"}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
