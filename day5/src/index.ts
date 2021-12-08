import { readFile } from "fs/promises";

type Point = { x: number; y: number };
type Intersection = Point & { count: number };
class VentLine {
  protected _start: Point = { x: 0, y: 0 };
  protected _end: Point = { x: 0, y: 0 };
  constructor(input: string) {
    input.split(" -> ").map((s, i) => {
      const coordinates = s.trim().split(",");
      if (i === 0) {
        this._start = {
          x: parseInt(coordinates[0]),
          y: parseInt(coordinates[1]),
        };
      } else {
        this._end = {
          x: parseInt(coordinates[0]),
          y: parseInt(coordinates[1]),
        };
      }
    });
  }
  is_rectilinear(): boolean {
    return this._start.x === this._end.x || this._start.y === this._end.y;
  }
  *points(): IterableIterator<Point> {
    const x_range =
      this._start.x < this._end.x
        ? [this._start.x, this._end.x]
        : [this._end.x, this._start.x];
    const y_range =
      this._start.y < this._end.y
        ? [this._start.y, this._end.y]
        : [this._end.y, this._start.y];
    if (this.is_rectilinear()) {
      for (let x = x_range[0]; x <= x_range[1]; x++) {
        for (let y = y_range[0]; y <= y_range[1]; y++) {
          yield { x, y };
        }
      }
    } else {
      const dx = this._end.x - this._start.x;
      const dy = this._end.y - this._start.y;
      const m = dy / dx;
      const b = this._start.y - m * this._start.x;
      for (let x = x_range[0]; x <= x_range[1]; x++) {
        const y = m * x + b;
        yield { x, y };
      }
    }
  }
}

class Diagram {
  private _points: { [x: number]: { [y: number]: number } } = {};
  constructor(vent_lines: VentLine[]) {
    vent_lines.forEach((vl: VentLine) => {
      for (const p of vl.points()) {
        this._points[p.x] = this._points[p.x] || {};
        this._points[p.x][p.y] = (this._points[p.x][p.y] || 0) + 1;
      }
    });
  }
  *intersections(): IterableIterator<Intersection> {
    for (const x in this._points) {
      for (const y in this._points[x]) {
        if (this._points[x][y] > 1) {
          yield { x: parseInt(x), y: parseInt(y), count: this._points[x][y] };
        }
      }
    }
  }
}

const raw_input = await readFile(process.argv[2], "utf8");
const raw_lines = raw_input.split("\n");
const vent_lines: VentLine[] = raw_lines.map((line) => new VentLine(line));
const rectilinear_lines = vent_lines.filter((line) => line.is_rectilinear());
const diagram_1 = new Diagram(rectilinear_lines);
const intersections = [...diagram_1.intersections()];
process.stdout.write(`Part 1: ${intersections.length}\n`);
const diagram_2 = new Diagram(vent_lines);
const intersections_2 = [...diagram_2.intersections()];
process.stdout.write(`Part 2: ${intersections_2.length}\n`);
