## Motivation

I wanted a JavaScript chess library that was modern, dependency-free, and had a real API instead of a jQuery plugin from 2013. Existing options either required heavy dependencies, had limited programmatic control, or couldn't enforce legal moves.

## What It Does

Chessboard.js is an NPM package that provides a fully interactive, customizable chessboard for web applications. It handles:

- **Drag-and-drop** and **click-to-move** interaction
- **Legal move enforcement** with full chess rules
- **Smooth animations** for piece movement
- **Programmatic control** via a comprehensive API (FEN positions, move history, game state queries)
- **Customizable appearance** (board colors, piece sets, board orientation, highlighting)

The library is **zero-dependency**: no jQuery, no React, no framework lock-in. Import it in any JavaScript project and it works.

## Design Decisions

**API-first design**: the board exposes a rich programmatic interface (`getPosition`, `movePiece`, `undoMove`, `getLegalMoves`, `fen`, `isCheckmate`, etc.) so it can be controlled entirely through code. This makes it suitable for analysis tools, chess engines, and educational applications, not just game displays.

**Full game logic included**: unlike libraries that only handle the visual board and delegate rules to a separate engine, Chessboard.js includes complete move validation, checkmate/draw detection, and game history. One package, zero dependencies.

**Static factory methods**: `Chessboard.create()`, `Chessboard.fromTemplate()`, and `Chessboard.listInstances()` enable managing multiple boards on the same page, useful for puzzles, analysis, and tournament displays.

## Impact

The library is published on npm as `@alepot55/chessboardjs`. It was my first open-source package and taught me a lot about API design, documentation, and the importance of thinking about developer experience from the consumer's perspective.
