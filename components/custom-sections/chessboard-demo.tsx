"use client"

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react"
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

/* ── Feature notes ────────────────────────────────────────────── */

const FEATURES = [
  {
    title: "Zero Dependencies",
    description: "Pure TypeScript: no chess.js, no stockfish, no external engines",
  },
  {
    title: "Legal Move Validation",
    description: "Full rule enforcement: castling, en passant, promotion, pins",
  },
  {
    title: "Rich API",
    description: "load(), flip(), undo, history, check detection, FEN import/export",
  },
]

/* ── Board palette ────────────────────────────────────────────────
   chessboard.css paints squares with var(--whiteSquare) & co. The
   library writes those custom properties on <html>; declaring them on
   the board container shadows that for the whole board subtree, so the
   squares are derived from the six tokens and follow the theme.
   ─────────────────────────────────────────────────────────────── */

const BOARD_THEME = {
  "--whiteSquare": "hsl(var(--surface))",
  "--blackSquare": "hsl(var(--ink) / 0.12)",
  "--selectedSquareWhite": "hsl(var(--limit) / 0.22)",
  "--selectedSquareBlack": "hsl(var(--limit) / 0.32)",
  "--movedSquareWhite": "hsl(var(--ink) / 0.06)",
  "--movedSquareBlack": "hsl(var(--ink) / 0.2)",
  "--choiceSquare": "hsl(var(--surface))",
  "--coverSquare": "hsl(var(--ink) / 0.55)",
  "--hintColor": "hsl(var(--ref) / 0.5)",
} as CSSProperties

const CONTROL =
  "flex min-h-[44px] items-center rounded px-3 font-mono text-meta text-ref transition-colors duration-150 hover:text-ink hover:bg-ink/[0.04] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ref"

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
      setStatus(board.turn() === "w" ? "Checkmate, Black wins" : "Checkmate, White wins")
    } else if (board.isDraw()) {
      setStatus("Draw")
    } else if (board.isGameOver()) {
      setStatus("Game over")
    } else if (board.inCheck()) {
      setStatus("Check")
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
    <div className="space-y-8">
      {/* Feature notes */}
      <div className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title}>
            <h4 className="font-mono text-unit text-ink">{feature.title}</h4>
            <p className="mt-1 text-body text-ref">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Interactive demo: the board needs a real surface */}
      <div className="overflow-hidden rounded border border-rail bg-surface">
        {/* Preset tabs */}
        <div className="flex flex-wrap items-center gap-1 px-3 pt-2">
          {PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              onClick={() => loadPreset(i)}
              className={`flex min-h-[44px] items-center rounded px-3 font-mono text-meta transition-colors duration-150 ${
                activePreset === i
                  ? "bg-ink/[0.07] text-ink"
                  : "text-ref hover:bg-ink/[0.04] hover:text-ink"
              }`}
            >
              {preset.label}
            </button>
          ))}
          <span className="ml-auto hidden pr-1 font-mono text-meta text-ref sm:inline">
            {PRESETS[activePreset].description}
          </span>
        </div>

        {/* Board + side panel */}
        <div className="flex flex-col lg:flex-row">
          {/* Board */}
          <div className="p-4 sm:p-6 lg:max-w-[560px] lg:flex-1">
            <div
              ref={containerRef}
              id="chess-demo-board"
              style={BOARD_THEME}
              className="mx-auto aspect-square w-full"
            />
          </div>

          {/* Side panel */}
          <div className="flex min-h-0 flex-col border-t border-rail lg:w-60 lg:border-l lg:border-t-0">
            {/* Turn indicator */}
            <div className="border-b border-rail px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${
                    turn === "w" ? "border border-ink" : "bg-ink"
                  }`}
                />
                <span className="font-mono text-meta text-ink">
                  {status || (ready ? `${turn === "w" ? "White" : "Black"} to move` : "Loading")}
                </span>
              </div>
              {status === "Check" && (
                <span className="mt-0.5 block pl-[18px] font-mono text-meta text-limit">
                  Get out of check
                </span>
              )}
            </div>

            {/* Move history */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3">
              <h4 className="mb-2 font-mono text-meta text-ref">Moves</h4>
              <div
                ref={moveListRef}
                className="min-h-[120px] max-h-[280px] flex-1 overflow-y-auto font-mono text-meta lg:max-h-none"
              >
                {movePairs.length === 0 ? (
                  <p className="text-ref">No moves yet</p>
                ) : (
                  <div className="space-y-0.5">
                    {movePairs.map((pair) => (
                      <div key={pair.num} className="flex gap-2 text-ink">
                        <span className="w-6 shrink-0 text-right text-ref tnum">
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
            <div className="flex gap-1 border-t border-rail px-3 py-1">
              <button
                onClick={handleUndo}
                disabled={moves.length === 0}
                title="Undo last move"
                className={CONTROL}
              >
                undo
              </button>
              <button onClick={handleReset} title="Reset to preset position" className={CONTROL}>
                reset
              </button>
              <button onClick={handleFlip} title="Flip board" className={`${CONTROL} ml-auto`}>
                flip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
