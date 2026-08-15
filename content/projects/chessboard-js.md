## In short

- I wanted a JavaScript chess library that was modern, dependency-free and had a real API instead of a jQuery plugin from 2013.
- Existing options either required heavy dependencies, had limited programmatic control, or could not enforce legal moves.
- Chessboard.js is a zero-dependency npm package: an interactive board with full chess rules and an API designed to be driven from code.
- Move validation, checkmate and draw detection and game history ship inside the same package, so no separate engine is needed.
- Published on npm as `@alepot55/chessboardjs`. It was my first open-source package.

## What it does

- **Drag-and-drop** and **click-to-move** interaction
- **Legal move enforcement** with full chess rules
- **Smooth animations** for piece movement
- **Programmatic control** via a comprehensive API: FEN positions, move history, game state queries
- **Customizable appearance**: board colors, piece sets, board orientation, highlighting

The library is zero-dependency: no jQuery, no React, no framework lock-in. Import it in any JavaScript project and it works.

## Design decisions

- **API-first design.** The board exposes a rich programmatic interface (`getPosition`, `movePiece`, `undoMove`, `getLegalMoves`, `fen`, `isCheckmate` and more) so it can be controlled entirely through code. That makes it suitable for analysis tools, chess engines and educational applications, not just game displays.
- **Full game logic included.** Unlike libraries that handle only the visual board and delegate rules to a separate engine, this one includes complete move validation, checkmate and draw detection, and game history. One package, zero dependencies.
- **Static factory methods.** `Chessboard.create()`, `Chessboard.fromTemplate()` and `Chessboard.listInstances()` make it practical to manage multiple boards on the same page, which puzzles, analysis and tournament displays all need.

## Status

The library is published on npm as `@alepot55/chessboardjs`.

Building it taught me a lot about API design, documentation, and the importance of thinking about developer experience from the consumer's perspective.
