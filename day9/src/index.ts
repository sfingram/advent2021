import { readFile } from "fs/promises";
import pkg from "js-graph-algorithms";
const { Graph, ConnectedComponents } = pkg;

const raw_input = await readFile(process.argv[2], "utf8");
const grid: number[][] = raw_input
  .split("\n")
  .map((line) => line.trim().split("").map(Number));
const part_1 = grid
  .map((row, i) => {
    return row
      .map((cell, j) => {
        const neighbors = [];
        if (i > 0) neighbors.push(grid[i - 1][j]);
        if (i < grid.length - 1) neighbors.push(grid[i + 1][j]);
        if (j > 0) neighbors.push(grid[i][j - 1]);
        if (j < row.length - 1) neighbors.push(grid[i][j + 1]);
        return neighbors.every((n) => n > cell) ? cell + 1 : 0;
      })
      .reduce((a, b) => a + b, 0);
  })
  .reduce((a, b) => a + b, 0);
process.stdout.write(`Part 1: ${part_1}\n`);

const graph = new Graph(grid.length * grid[0].length);
grid.forEach((row, i) =>
  row.forEach((cell, j) => {
    if (cell < 9) {
      if (i > 0 && grid[i - 1][j] !== 9) {
        graph.addEdge(i * row.length + j, (i - 1) * row.length + j);
      }
      if (i < grid.length - 1 && grid[i + 1][j] !== 9) {
        graph.addEdge(i * row.length + j, (i + 1) * row.length + j);
      }
      if (j > 0 && grid[i][j - 1] !== 9) {
        graph.addEdge(i * row.length + j, i * row.length + (j - 1));
      }
      if (j < row.length - 1 && grid[i][j + 1] !== 9) {
        graph.addEdge(i * row.length + j, i * row.length + (j + 1));
      }
    }
  })
);
const cc = new ConnectedComponents(graph);
const cc_counter: { [key: number]: number } = {};
for (let n = 0; n < graph.V; n++) {
  cc_counter[cc.componentId(n)] = (cc_counter[cc.componentId(n)] || 0) + 1;
}
// find the three largest cc_counter values and multiply them together
const part_2 = Object.values(cc_counter)
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a * b, 1);
process.stdout.write(`Part 2: ${part_2}\n`);
