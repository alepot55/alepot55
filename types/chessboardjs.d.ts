declare module "@alepot55/chessboardjs" {
  interface ChessboardOptions {
    position?: string
    size?: string
    orientation?: "w" | "b"
    draggable?: boolean
    clickable?: boolean
    mode?: string
    hints?: boolean
    moveHighlight?: boolean
    piecesPath?: string
    whiteSquare?: string
    blackSquare?: string
    selectedSquareWhite?: string
    selectedSquareBlack?: string
    movedSquareWhite?: string
    movedSquareBlack?: string
    hintColor?: string
    highlight?: string
    onMoveEnd?: () => boolean
  }

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

  export function Chessboard(
    elementId: string,
    options: ChessboardOptions
  ): ChessboardInstance

  export default Chessboard
}
