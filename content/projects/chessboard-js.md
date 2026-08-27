## I wrote it in 2023 against a jQuery plugin from 2013

I wanted to drive a chess board from a script. The options I found required jQuery or another framework, exposed little programmatic control, or could not enforce legality. It was the first open-source package I published, as `@alepot55/chessboardjs`.

## Four rule systems ship inside the same package

Move validation, checkmate detection, draw detection and game history run in the package that draws the board. Libraries that render only leave legality to a chess engine the consumer wires in; this one refuses an illegal move on its own.

## Six methods drive a whole game from code

`getPosition`, `movePiece`, `undoMove`, `getLegalMoves`, `fen` and `isCheckmate` cover reading the position, mutating it, undoing, legality and terminal state. I designed the API before the rendering, so a chess engine, an analysis tool or a teaching app can drive the board entirely through code.

## Three static factories manage the boards on one page

`Chessboard.create()`, `Chessboard.fromTemplate()` and `Chessboard.listInstances()` construct boards and enumerate the live ones, which a puzzle set or a tournament display needs.

## Two input paths, drag and click, on the same board

A piece moves by drag-and-drop or by click-to-move, and the movement animates. Board colours, piece sets, orientation and square highlighting are set by the caller.
