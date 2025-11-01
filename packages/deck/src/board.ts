import { Cell, Board, Row, Deck } from "@workspace/deck/types";

export function generateBoard(
  rows: number,
  cols: number,
  initial: Board,
): Board {
  const board: Board = {};

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const row: Row = { ...(initial[rowIndex] ?? {}) };
    board[rowIndex] = row;

    for (let colIndex = 0; colIndex < cols; colIndex++) {
      row[colIndex] = {
        ...(row[colIndex] ?? { id: crypto.randomUUID() }),
      };
    }
  }

  return board;
}

export function getCell(
  board: Board,
  row: number,
  col: number,
): Cell | undefined {
  const columns = board[row] ?? {};
  const cell = columns[col];

  return cell;
}

export function setCell(
  board: Board,
  row: number,
  col: number,
  cell: Cell,
): Board {
  const columns = board[row] ?? {};

  return {
    ...board,
    [row]: {
      ...columns,
      [col]: cell,
    },
  };
}

export type FindCellByIdResult = {
  row: number;
  col: number;
  cell: Cell;
};

export function findCellById(
  board: Board,
  id: string,
): FindCellByIdResult | undefined {
  for (const [rowIndex, row] of Object.entries(board)) {
    for (const [colIndex, findCell] of Object.entries(row)) {
      if (findCell.id == id) {
        return { row: Number(rowIndex), col: Number(colIndex), cell: findCell };
      }
    }
  }

  return undefined;
}

export function setCellById(board: Board, cell: Cell): Board {
  const findCell = findCellById(board, cell.id);

  if (findCell) {
    return setCell(board, findCell.row, findCell.col, cell);
  }

  return board;
}

export function defaultDeck(): Deck {
  return {
    pages: [
      {
        id: crypto.randomUUID(),
        board: {},
      },
    ],
  };
}
