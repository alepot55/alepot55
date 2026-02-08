declare module "@alepot55/chessboardjs" {
  interface ChessboardOptions {
    position?: string
    size?: string | number
    orientation?: "w" | "b"
    draggable?: boolean
    clickable?: boolean
    mode?: string
    hints?: boolean
    moveHighlight?: boolean
    onlyLegalMoves?: boolean
    piecesPath?: string
    whiteSquare?: string
    blackSquare?: string
    selectedSquareWhite?: string
    selectedSquareBlack?: string
    movedSquareWhite?: string
    movedSquareBlack?: string
    hintColor?: string
    highlight?: string
    animationStyle?: "sequential" | "simultaneous"
    flipMode?: "visual" | "animate" | "none"
    moveTime?: number
    moveStyle?: "slide" | "arc" | "hop" | "teleport" | "fade"
    captureStyle?: "fade" | "shrink" | "instant" | "explode"
    moveEasing?: string
    onMove?: (move: unknown) => boolean
    onMoveEnd?: (move?: unknown) => boolean | void
    onChange?: (fen: string) => void
    onDragStart?: (...args: unknown[]) => void
    onDragMove?: (...args: unknown[]) => void
    onDrop?: (...args: unknown[]) => void
  }

  interface ChessboardInstance {
    // Position & State
    fen: () => string
    turn: () => "w" | "b"
    setPosition: (position: string, opts?: { animate?: boolean }) => boolean
    getPosition: () => string
    load: (fen: string, options?: Record<string, unknown>, animate?: boolean) => boolean
    reset: (opts?: { animate?: boolean }) => boolean
    clear: (opts?: { animate?: boolean }) => boolean

    // Move Management
    undoMove: (opts?: { animate?: boolean }) => unknown
    redoMove: (opts?: { animate?: boolean }) => unknown
    movePiece: (moveStr: string, opts?: { animate?: boolean }) => unknown
    getHistory: () => string[]
    getLegalMoves: (square: string) => unknown[]

    // Board Control
    flip: (opts?: { animate?: boolean; mode?: string }) => void
    flipBoard: (opts?: { animate?: boolean; mode?: string }) => void
    setOrientation: (color: "w" | "b", opts?: { animate?: boolean; mode?: string }) => string
    getOrientation: () => "w" | "b"
    resizeBoard: (size: number | string) => boolean

    // Game Info
    isGameOver: () => boolean
    isCheckmate: () => boolean
    isDraw: () => boolean
    inCheck: () => boolean
    inStalemate: () => boolean
    inDraw: () => boolean
    inCheckmate: () => boolean
    inThreefoldRepetition: () => boolean
    moveNumber: () => number
    pgn: () => string
    loadPgn: (pgn: string, options?: Record<string, unknown>, animate?: boolean) => boolean

    // Piece Management
    getPiece: (square: string) => string | null
    putPiece: (piece: string, square: string, opts?: { animate?: boolean }) => boolean
    removePiece: (square: string, opts?: { animate?: boolean }) => boolean

    // Highlighting
    highlight: (square: string, opts?: Record<string, unknown>) => void
    dehighlight: (square: string, opts?: Record<string, unknown>) => void

    // Movement Configuration
    setMoveStyle: (style: string) => void
    getMoveStyle: () => string
    setMoveTime: (duration: number | string) => void
    getMoveTime: () => number
    setFlipMode: (mode: string) => void
    getFlipMode: () => string
    configureMovement: (options: Record<string, unknown>) => void
    getMovementConfig: () => Record<string, unknown>

    // Lifecycle
    destroy: () => void
    rebuild: () => void

    // Configuration
    getConfig: () => unknown
    setConfig: (newConfig: Record<string, unknown>) => void
  }

  export function Chessboard(
    elementId: string,
    options: ChessboardOptions
  ): ChessboardInstance

  export default Chessboard
}
