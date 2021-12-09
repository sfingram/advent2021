import { readFile } from "fs/promises";

const raw_input = await readFile(process.argv[2], "utf8");
const steps_input = Number(process.argv[3]);
const lantern_fish = raw_input.trim().split(",").map(Number);
const memoization_table: { [key: number]: { [key: number]: number } } = {};
function get_or_calculate(input: number, steps: number): number {
  if (input in memoization_table) {
    if (steps in memoization_table[input]) {
      return memoization_table[input][steps];
    }
  }
  let val = 1;
  let state = input;
  // loop forward in time and calculate the values
  for (let i = 0; i < steps; i++) {
    state--;
    if (state < 0) {
      state = 6;
      val += get_or_calculate(8, steps - i - 1);
    }
  }

  // store the result
  memoization_table[input] = memoization_table[input] || {};
  memoization_table[input][steps] = val;

  return val;
}
const part_1 = lantern_fish.reduce(
  (acc, curr) => acc + get_or_calculate(curr, steps_input),
  0
);
process.stdout.write(`Answer: ${part_1}\n`);
