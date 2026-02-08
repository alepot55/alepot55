"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Undo2 } from "lucide-react"
import "@alepot55/chessboardjs/src/styles/index.css"
import type { Project } from "@/data/projects"

interface ChessboardInstance {
  reset: (opts?: { animate?: boolean }) => void
  undoMove: (opts?: { animate?: boolean }) => unknown
  getHistory: () => string[]
  fen: () => string
  turn: () => "w" | "b"
  isGameOver: () => boolean
  isCheckmate: () => boolean
  isDraw: () => boolean
  destroy: () => void
}

const basePath = process.env.NODE_ENV === "production" ? "/alepot55" : ""

export function ChessboardDemo({ project }: { project: Project }) {
  const boardRef = useRef<ChessboardInstance | null>(null)
  const [moves, setMoves] = useState<string[]>([])
  const [turn, setTurn] = useState<"w" | "b">("w")
  const [status, setStatus] = useState<string>("")
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateState = useCallback(() => {
    if (!boardRef.current) return
    const board = boardRef.current
    setMoves(board.getHistory())
    setTurn(board.turn())
    if (board.isCheckmate()) {
      setStatus("Checkmate!")
    } else if (board.isDraw()) {
      setStatus("Draw!")
    } else if (board.isGameOver()) {
      setStatus("Game Over")
    } else {
      setStatus("")
    }
  }, [])

  useEffect(() => {
    let board: ChessboardInstance | null = null

    async function init() {
      if (!containerRef.current) return

      const mod = await import("@alepot55/chessboardjs")
      const Chessboard = mod.default || mod.Chessboard

      board = Chessboard("chess-demo-board", {
        position: "start",
        size: "auto",
        orientation: "w",
        draggable: true,
        clickable: true,
        mode: "normal",
        hints: true,
        moveHighlight: true,
        piecesPath: `${basePath}/pieces`,
        whiteSquare: "#e8dcc8",
        blackSquare: "#7a6654",
        selectedSquareWhite: "#c8b898",
        selectedSquareBlack: "#6a5644",
        movedSquareWhite: "#d4c8a0",
        movedSquareBlack: "#8a7a58",
        hintColor: "#9a8a7a",
        onMoveEnd: () => {
          updateState()
          return true
        },
      }) as ChessboardInstance

      boardRef.current = board
      setReady(true)
    }

    init()

    return () => {
      if (board) {
        try { board.destroy() } catch {}
      }
      boardRef.current = null
    }
  }, [updateState])

  const handleReset = () => {
    if (!boardRef.current) return
    boardRef.current.reset()
    setMoves([])
    setTurn("w")
    setStatus("")
  }

  const handleUndo = () => {
    if (!boardRef.current || moves.length === 0) return
    boardRef.current.undoMove()
    updateState()
  }

  const movePairs: Array<{ num: number; white: string; black?: string }> = []
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 w-full lg:flex-1 lg:max-w-[600px]">
          <div
            ref={containerRef}
            id="chess-demo-board"
            className="w-full aspect-square mx-auto"
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={moves.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Undo2 size={14} />
                Undo
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2">
              {status ? (
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {status}
                </span>
              ) : ready ? (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {turn === "w" ? "White" : "Black"} to move
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {moves.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 w-full lg:w-56"
          >
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Moves
            </h4>
            <div className="font-mono text-sm space-y-1 max-h-[420px] overflow-y-auto">
              {movePairs.map((pair) => (
                <div key={pair.num} className="flex gap-2 text-gray-600 dark:text-gray-300">
                  <span className="text-gray-400 dark:text-gray-600 w-6 text-right shrink-0">
                    {pair.num}.
                  </span>
                  <span className="w-12">{pair.white}</span>
                  {pair.black && <span className="w-12">{pair.black}</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
