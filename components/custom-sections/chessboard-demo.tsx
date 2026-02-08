"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Undo2, FlipVertical, Package, Shield, Code2 } from "lucide-react"
import "@alepot55/chessboardjs/dist/chessboard.css"
import type { Project } from "@/data/projects"

/* ── Types ────────────────────────────────────────────────────── */

interface ChessboardInstance {
  reset: (opts?: { animate?: boolean }) => void
  undoMove: (opts?: { animate?: boolean }) => unknown
  getHistory: () => string[]
  fen: () => string
  turn: () => "w" | "b"
  isGameOver: () => boolean
  isCheckmate: () => boolean
  isDraw: () => boolean
  inCheck: () => boolean
  destroy: () => void
  flip: (opts?: { animate?: boolean; mode?: string }) => void
  flipBoard: (opts?: { animate?: boolean; mode?: string }) => void
  load: (fen: string, options?: Record<string, unknown>, animate?: boolean) => boolean
  setPosition: (position: string, opts?: { animate?: boolean }) => boolean
  moveNumber: () => number
}

/* ── Preset positions ─────────────────────────────────────────── */

interface Preset {
  label: string
  fen: string
  description: string
}

const PRESETS: Preset[] = [
  {
    label: "New Game",
    fen: "start",
    description: "Standard starting position",
  },
  {
    label: "Italian Game",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    description: "Classic opening after 1.e4 e5 2.Nf3 Nc6 3.Bc4",
  },
  {
    label: "Endgame",
    fen: "8/8/8/8/8/5k2/3Q4/4K3 w - - 0 1",
    description: "King + Queen vs King",
  },
]

/* ── Feature cards data ───────────────────────────────────────── */

const FEATURES = [
  {
    icon: Package,
    title: "Zero Dependencies",
    description: "Pure TypeScript — no chess.js, no stockfish, no external engines",
  },
  {
    icon: Shield,
    title: "Legal Move Validation",
    description: "Full rule enforcement: castling, en passant, promotion, pins",
  },
  {
    icon: Code2,
    title: "Rich API",
    description: "load(), flip(), undo, history, check detection, FEN import/export",
  },
]

/* ── Component ────────────────────────────────────────────────── */

const basePath = process.env.NODE_ENV === "production" ? "/alepot55" : ""

export function ChessboardDemo({ project }: { project: Project }) {
  const boardRef = useRef<ChessboardInstance | null>(null)
  const [moves, setMoves] = useState<string[]>([])
  const [turn, setTurn] = useState<"w" | "b">("w")
  const [status, setStatus] = useState<string>("")
  const [ready, setReady] = useState(false)
  const [activePreset, setActivePreset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const moveListRef = useRef<HTMLDivElement>(null)

  const updateState = useCallback(() => {
    if (!boardRef.current) return
    const board = boardRef.current
    setMoves(board.getHistory())
    setTurn(board.turn())
    if (board.isCheckmate()) {
      setStatus(board.turn() === "w" ? "Checkmate — Black wins!" : "Checkmate — White wins!")
    } else if (board.isDraw()) {
      setStatus("Draw!")
    } else if (board.isGameOver()) {
      setStatus("Game Over")
    } else if (board.inCheck()) {
      setStatus("Check!")
    } else {
      setStatus("")
    }
  }, [])

  // Auto-scroll move list to bottom
  useEffect(() => {
    if (moveListRef.current) {
      moveListRef.current.scrollTop = moveListRef.current.scrollHeight
    }
  }, [moves])

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
        try { board.destroy() } catch { /* noop */ }
      }
      boardRef.current = null
    }
  }, [updateState])

  const loadPreset = (index: number) => {
    if (!boardRef.current) return
    const preset = PRESETS[index]
    setActivePreset(index)

    if (preset.fen === "start") {
      boardRef.current.reset()
    } else {
      boardRef.current.load(preset.fen)
    }

    setMoves([])
    setTurn(preset.fen === "start" ? "w" : preset.fen.split(" ")[1] as "w" | "b")
    setStatus("")
  }

  const handleReset = () => {
    loadPreset(activePreset)
  }

  const handleUndo = () => {
    if (!boardRef.current || moves.length === 0) return
    boardRef.current.undoMove()
    updateState()
  }

  const handleFlip = () => {
    if (!boardRef.current) return
    boardRef.current.flip()
  }

  // Build move pairs for display
  const movePairs: Array<{ num: number; white: string; black?: string }> = []
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    })
  }

  return (
    <div className="space-y-6">
      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7a6654]/10 dark:bg-[#e8dcc8]/10">
                <feature.icon size={16} className="text-[#7a6654] dark:text-[#e8dcc8]" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {feature.title}
              </h4>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Interactive demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden"
      >
        {/* Preset tabs */}
        <div className="flex items-center gap-1 px-4 pt-4 pb-2">
          {PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              onClick={() => loadPreset(i)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activePreset === i
                  ? "bg-[#7a6654] text-white dark:bg-[#e8dcc8] dark:text-gray-900 font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {preset.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
            {PRESETS[activePreset].description}
          </span>
        </div>

        {/* Board + side panel */}
        <div className="flex flex-col lg:flex-row">
          {/* Board */}
          <div className="p-4 sm:p-6 lg:flex-1 lg:max-w-[560px]">
            <div
              ref={containerRef}
              id="chess-demo-board"
              className="w-full aspect-square mx-auto"
            />
          </div>

          {/* Side panel */}
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 lg:w-60 min-h-0">
            {/* Turn indicator */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    turn === "w"
                      ? "bg-[#e8dcc8] border border-gray-300 dark:border-gray-600"
                      : "bg-[#7a6654]"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {status || (ready ? `${turn === "w" ? "White" : "Black"} to move` : "Loading...")}
                </span>
              </div>
              {status === "Check!" && (
                <span className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 block pl-[18px]">
                  Get out of check!
                </span>
              )}
            </div>

            {/* Move history */}
            <div className="flex-1 min-h-0 px-4 py-3 overflow-hidden flex flex-col">
              <h4 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                Moves
              </h4>
              <div
                ref={moveListRef}
                className="flex-1 overflow-y-auto font-mono text-sm min-h-[120px] max-h-[280px] lg:max-h-none"
              >
                {movePairs.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-600 italic">
                    Make a move to begin...
                  </p>
                ) : (
                  <div className="space-y-0.5">
                    {movePairs.map((pair) => (
                      <div key={pair.num} className="flex gap-2 text-gray-600 dark:text-gray-300">
                        <span className="text-gray-400 dark:text-gray-600 w-6 text-right shrink-0 tabular-nums">
                          {pair.num}.
                        </span>
                        <span className="w-14">{pair.white}</span>
                        {pair.black && <span className="w-14">{pair.black}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex gap-2">
              <button
                onClick={handleUndo}
                disabled={moves.length === 0}
                title="Undo last move"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Undo2 size={14} />
                Undo
              </button>
              <button
                onClick={handleReset}
                title="Reset to preset position"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={handleFlip}
                title="Flip board"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
              >
                <FlipVertical size={14} />
                Flip
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
