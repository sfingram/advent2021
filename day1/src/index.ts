import { readFile } from "fs/promises";

type ReducerFunction = (arg0: number, arg1: number, arg2: number) => number;
function makeReducer(lookback: number): ReducerFunction {
  return (acc, _curr, index) => {
    if (index >= lookback) {
      const p = numbers
        .slice(index - lookback + 1, index + 1)
        .reduce((a, b) => a + b);
      const pp = numbers.slice(index - lookback, index).reduce((a, b) => a + b);
      if (p > pp) {
        return acc + 1;
      }
    }
    return acc;
  };
}

const raw_input = await readFile(process.argv[2], "utf8");
const numbers = raw_input.split("\n").map(Number);
console.log("Part one:", numbers.reduce(makeReducer(1), 0));
console.log("Part two:", numbers.reduce(makeReducer(3), 0));
