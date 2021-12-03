import { readFile } from "fs/promises";

const raw_input = await readFile(process.argv[2], "utf8");

type Direction = "forward" | "down" | "up";
type Command = { direction: Direction; steps: number };
type Location = { position: number; depth: number };
type AimedLocation = { position: number; depth: number; aim: number };

function parse_command(line: string): Command {
  const [direction_string, steps] = line.split(" ");
  const direction: Direction =
    direction_string === "forward"
      ? "forward"
      : direction_string === "down"
      ? "down"
      : "up";
  return { direction, steps: parseInt(steps) };
}

const parsed_input = raw_input.split("\n").map(parse_command);
const step_1_reducer = (acc: Location, cur: Command) => {
  if (cur.direction === "down") {
    acc.depth += cur.steps;
  }
  if (cur.direction === "up") {
    acc.depth -= cur.steps;
  }
  if (cur.direction === "forward") {
    acc.position += cur.steps;
  }
  return acc;
};
const step_2_reducer = (acc: AimedLocation, cur: Command) => {
  if (cur.direction === "down") {
    acc.aim += cur.steps;
  }
  if (cur.direction === "up") {
    acc.aim -= cur.steps;
  }
  if (cur.direction === "forward") {
    acc.position += cur.steps;
    acc.depth += acc.aim * cur.steps;
  }
  return acc;
};
const part_1 = parsed_input.reduce(step_1_reducer, { position: 0, depth: 0 });
const part_2 = parsed_input.reduce(step_2_reducer, {
  position: 0,
  depth: 0,
  aim: 0,
});
console.log("Part 1:", part_1.depth * part_1.position);
console.log("Part 2:", part_2.depth * part_2.position);
