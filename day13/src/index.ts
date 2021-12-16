import { readFile } from "fs/promises";

const raw_input = await readFile(process.argv[2], "utf8");

// separate the input into coordinate lists and fold instructions

const trimmed = raw_input.split("\n").map((line) => line.trim());
const blank_line_index = trimmed.indexOf("");
const coordinate_lists = trimmed.filter((_, i) => i < blank_line_index);
const instructions = trimmed.filter((_, i) => i > blank_line_index);

interface Fold {
  position: number;
  orientation: "x" | "y";
}
interface Point {
  x: number;
  y: number;
}
class Fold implements Fold {
  constructor(public position: number, public orientation: "x" | "y") {}
}
class Point implements Point {
  public x = 0;
  public y = 0;
  static fromLine(line: string): Point {
    const [x, y] = line.split(",").map(Number);
    return new this(x, y);
  }
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  fold(fold: Fold) {
    if (fold.orientation === "x") {
      if (this.x >= fold.position) {
        this.x -= 2 * (this.x - fold.position);
      }
    }
    if (fold.orientation === "y") {
      if (this.y >= fold.position) {
        this.y -= 2 * (this.y - fold.position);
      }
    }
  }
}
const coordinates = coordinate_lists.map((line) => Point.fromLine(line));
const folds = instructions.map((line) => {
  const [orientation, position] = line.split(" ")[2].split("=");
  return new Fold(Number(position), orientation === "x" ? "x" : "y");
});
coordinates.forEach((coordinate) => coordinate.fold(folds[0]));
let coordinate_set: Set<string> = new Set(
  coordinates.map((coordinate) => coordinate.x + "," + coordinate.y)
);
console.log(`Part 1: ${coordinate_set.size}`);
folds
  .filter((_, i) => i > 0)
  .forEach((fold) =>
    coordinates.forEach((coordinate) => coordinate.fold(fold))
  );
coordinate_set = new Set(
  coordinates.map((coordinate) => coordinate.x + "," + coordinate.y)
);
const max_x = Math.max(...coordinates.map((coordinate) => coordinate.x));
const max_y = Math.max(...coordinates.map((coordinate) => coordinate.y));
for (let y = 0; y <= max_y; y++) {
  for (let x = 0; x <= max_x; x++) {
    if (coordinate_set.has(x + "," + y)) {
      process.stdout.write("#");
    } else {
      process.stdout.write(".");
    }
  }
  process.stdout.write("\n");
}
