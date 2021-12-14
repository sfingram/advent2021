import { readFile } from "fs/promises";

const raw_input = await readFile(process.argv[2], "utf8");
const lines = raw_input.split("\n").map((x) => x.trim());

interface IBrace {
  kind: "open" | "close";
  match?: IBrace;
  score: number;
  incomplete_score: number;
}

class Brace implements IBrace {
  public match?: IBrace = undefined;
  constructor(
    public kind: "open" | "close",
    public score: number = 0,
    public incomplete_score: number = 0
  ) {}
}

const braces: { [key: string]: Brace } = {
  "<": new Brace("open"),
  ">": new Brace("close", 25137, 4),
  "{": new Brace("open"),
  "}": new Brace("close", 1197, 3),
  "[": new Brace("open"),
  "]": new Brace("close", 57, 2),
  "(": new Brace("open"),
  ")": new Brace("close", 3, 1),
};
braces["{"].match = braces["}"];
braces["["].match = braces["]"];
braces["<"].match = braces[">"];
braces["("].match = braces[")"];

function is_incomplete(line: string): boolean {
  const stack: IBrace[] = [];
  for (const char of line) {
    const brace = braces[char];
    if (brace.kind === "open") {
      stack.push(brace);
    } else if (braces[char].kind === "close") {
      const open_brace = stack.pop();
      if (open_brace) {
        if (open_brace.kind === "open" && brace !== open_brace?.match) {
          return false;
        }
      }
    }
  }
  return stack.length > 0;
}

function parse_incomplete(line: string): number {
  const stack: IBrace[] = [];
  for (const char of line) {
    const brace = braces[char];
    if (brace.kind === "open") {
      stack.push(brace);
    } else if (braces[char].kind === "close") {
      stack.pop();
    }
  }
  let score = 0;
  for (const brace of stack.reverse()) {
    const match = brace.match;
    if (match) {
      score = score * 5 + match.incomplete_score;
    }
  }
  return score;
}

function parse_corrupt(line: string): number {
  const stack: IBrace[] = [];
  for (const char of line) {
    const brace = braces[char];
    if (brace.kind === "open") {
      stack.push(brace);
    } else if (braces[char].kind === "close") {
      const stack_brace = stack.pop();
      if (stack_brace) {
        if (stack_brace.kind === "open" && brace !== stack_brace?.match) {
          return brace.score;
        }
      }
    }
  }
  return 0;
}

const part_1 = lines.map(parse_corrupt).reduce((a, b) => a + b);
process.stdout.write(`Part 1: ${part_1}\n`);

const incomplete_lines = lines.filter(is_incomplete);
const part_2 = incomplete_lines.map(parse_incomplete).sort((a, b) => a - b)[
  Math.floor(incomplete_lines.length / 2)
];
process.stdout.write(`Part 2: ${part_2}\n`);
