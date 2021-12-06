import { readFile } from "fs/promises";

type BinaryNumber = 0 | 1;
type BinaryString = BinaryNumber[];

function make_binary(line: string): BinaryString {
  return line
    .trim()
    .split("")
    .map((char) => {
      if (char === "0") {
        return 0;
      }
      return 1;
    });
}

function update_ones(acc: number[], line: BinaryString) {
  line.forEach((value, index) => {
    acc[index] += value;
  });
  return acc;
}

const raw_input = await readFile(process.argv[2], "utf8");
const binary_lines = raw_input.split("\n").map(make_binary);
const gamma_raw = binary_lines
  .reduce(
    update_ones,
    binary_lines[0].map(() => 0)
  )
  .map((count) => {
    if (count / binary_lines.length > 0.5) {
      return 1;
    } else {
      return 0;
    }
  });
const gamma = parseInt(gamma_raw.join(""), 2);
const epsilon_raw = gamma_raw.map((x) => (x === 1 ? 0 : 1));
const epsilon = parseInt(epsilon_raw.join(""), 2);
console.log("Part 1:", gamma, epsilon, gamma * epsilon);

function o2_generator_digit(
  lines: readonly BinaryString[],
  digit: number
): BinaryNumber {
  return lines.reduce((acc, line) => {
    return acc + line[digit];
  }, 0) /
    lines.length >=
    0.5
    ? 1
    : 0;
}

function co2_scrubber_digit(
  lines: readonly BinaryString[],
  digit: number
): BinaryNumber {
  return o2_generator_digit(lines, digit) === 1 ? 0 : 1;
}

function winnow_candidates(
  candidates: readonly BinaryString[],
  digit_finder: (lines: readonly BinaryString[], digit: number) => BinaryNumber
): BinaryString {
  let digit = 0;
  while (candidates.length > 1) {
    const filter_digit = digit_finder(candidates, digit);
    candidates = candidates.filter((line) => line[digit] === filter_digit);
    digit++;
  }
  return candidates[0];
}

const o2_rating = winnow_candidates([...binary_lines], o2_generator_digit);
const co2_rating = winnow_candidates([...binary_lines], co2_scrubber_digit);
const life_support_rating =
  parseInt(o2_rating.join(""), 2) * parseInt(co2_rating.join(""), 2);
console.log("Part 2:", life_support_rating);
