import { readFile } from "fs/promises";

const raw_input = await readFile(process.argv[2], "utf8");

type Move = number;
class Bingo {
  protected _board: number[][] = [];
  protected _move_index: { [key: number]: [number, number] } = {};
  protected _rowCounts: { [key: number]: number } = {};
  protected _columnCounts: { [key: number]: number } = {};
  protected _diagonalCounts: { [key: number]: number } = {};
  protected _lastMove: Move = 0;
  protected _pastMoves: { [key: number]: boolean } = {};

  constructor(input: string[]) {
    input.forEach((line) => {
      const row = line.trim().replaceAll("  ", " ").split(" ").map(Number);
      this._board.push(row);
    });
    this._board.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        this._move_index[value] = [rowIndex, columnIndex];
      });
    });
  }

  print() {
    this._board.forEach((row) => {
      row.forEach((col) => {
        process.stdout.write(`${col} `);
      });
      process.stdout.write("\n");
    });
  }
  checkWin(): boolean {
    const rowCounts = Object.values(this._rowCounts);
    const columnCounts = Object.values(this._columnCounts);

    return (
      rowCounts.includes(this._board.length) ||
      columnCounts.includes(this._board.length)
    );
  }

  calculateWin(): number {
    if (this.checkWin()) {
      let unmarked_sum = 0;
      this._board.forEach((row) => {
        row.forEach((value) => {
          if (!(value in this._pastMoves)) {
            unmarked_sum += value;
          }
        });
      });

      return unmarked_sum * this._lastMove;
    }
    return -1;
  }

  handle(move: Move) {
    if (move in this._move_index) {
      const [row, column] = this._move_index[move];
      this._rowCounts[row] = (this._rowCounts[row] || 0) + 1;
      this._columnCounts[column] = (this._columnCounts[column] || 0) + 1;
      this._lastMove = move;
      this._pastMoves[move] = true;
    }
  }
}

const raw_lines = raw_input.split("\n");
const moves: Move[] = raw_lines[0].trim().split(",").map(Number);
const boards = raw_lines
  .slice(2)
  .reduce((acc: Bingo[], _line, index, array): Bingo[] => {
    if ((index + 1) % 6 === 0) {
      acc.push(new Bingo(array.slice(index - 5, index)));
    }
    if (index === array.length - 1) {
      acc.push(new Bingo(array.slice(index - 4, index + 1)));
    }
    return acc;
  }, []);

let found_winner = false;
const winning_boards: number[] = [];
for (const move of moves) {
  boards.forEach((board, index) => {
    if (!board.checkWin()) {
      board.handle(move);
      if (board.checkWin()) {
        if (!found_winner) {
          console.log("Part 1:", board.calculateWin());
          found_winner = true;
        }
        winning_boards.push(index);
      }
    }
  });
}
console.log(
  "Part 2:",
  boards[winning_boards[winning_boards.length - 1]].calculateWin()
);
