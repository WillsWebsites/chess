import { FC, useRef, useState } from 'react'

enum Pieces {
  WKing = 'K',
  WQueen = 'Q',
  WRook = 'R',
  WKnight = 'N',
  WBishop = 'B',
  WPawn = 'P',
  BKing = 'k',
  BQueen = 'q',
  BRook = 'r',
  BKnight = 'n',
  BBishop = 'b',
  BPawn = 'p'
}

const generateBoard = () => {
  const board: (Pieces | null)[][] = []
  const chessBoardSize = 8
  for (let i = 0; i < chessBoardSize; i++) {
    board.push([...Array(chessBoardSize)])
  }

  board[0][0] = Pieces.BRook
  board[0][7] = Pieces.BRook
  board[7][0] = Pieces.WRook
  board[7][7] = Pieces.WRook

  board[0][1] = Pieces.BKnight
  board[0][6] = Pieces.BKnight
  board[7][1] = Pieces.WKnight
  board[7][6] = Pieces.WKnight

  board[0][2] = Pieces.BBishop
  board[0][5] = Pieces.BBishop
  board[7][2] = Pieces.WBishop
  board[7][5] = Pieces.WBishop

  board[0][3] = Pieces.BQueen
  board[7][3] = Pieces.WQueen

  board[0][4] = Pieces.BKing
  board[7][4] = Pieces.WKing

  // Initialize the pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = Pieces.BPawn
    board[6][i] = Pieces.WPawn
  }

  return board
}

const getLightSquares = (r: number, s: number) => {
  return (r % 2 === 0 && s % 2 === 0) || (r % 2 === 1 && s % 2 === 1)
}

const getDarkSquares = (r: number, s: number) => {
  return (r % 2 === 0 && s % 2 === 1) || (r % 2 === 1 && s % 2 === 0)
}

const cn = (classNames: string) => classNames.trim().replace(/\s+/g, ' ')

const Board: FC = () => {
  const [board, setBoard] = useState(generateBoard())

  // Create a state to track the dragged piece
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null)

  // Create a ref to track the source square of the dragged piece
  const sourceSquareRef = useRef<{ r: number; s: number } | null>(null)

  // Function to handle the drag start event
  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>, piece: Pieces | null, r: number, s: number) => {
    if (piece === null || piece === undefined) return
    e.dataTransfer.setData('text/plain', piece as string)
    setDraggedPiece(piece)
    sourceSquareRef.current = { r, s }
  }

  // Function to handle the drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, r: number, s: number) => {
    e.preventDefault()
  }

  // Function to handle the drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, r: number, s: number) => {
    e.preventDefault()
    const droppedPiece = e.dataTransfer.getData('text/plain')

    // Update the board if the drop is valid
    if (sourceSquareRef.current) {
      const { r: sourceR, s: sourceS } = sourceSquareRef.current
      const updatedBoard = [...board]
      updatedBoard[r][s] = droppedPiece as Pieces
      updatedBoard[sourceR][sourceS] = null
      setBoard(updatedBoard)
    }

    setDraggedPiece(null)
    sourceSquareRef.current = null
  }

  return (
    <div>
      {board.map((row, r) => (
        <div key={r} className="flex w-full">
          {row.map((square, s) => (
            <div
              key={s}
              className={cn(
                `w-[100px] h-[100px] flex justify-center items-center select-none ${
                  getLightSquares(r, s) ? 'bg-[#ECD6AF]' : ''
                } ${getDarkSquares(r, s) ? 'bg-[#B88761]' : ''}`
              )}
              onDragOver={e => handleDragOver(e, r, s)}
              onDrop={e => handleDrop(e, r, s)}
            >
              {square && (
                <span
                  draggable
                  onDragStart={e => handleDragStart(e, square, r, s)}
                  className="flex justify-center items-center w-[100px] h-[100px] cursor-pointer select-none"
                >
                  {square}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Board
