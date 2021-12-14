import { readFile } from "fs/promises";

const raw_input = await readFile(process.argv[2], "utf8");
// const steps = parseInt(process.argv[3]);

interface Octopus {
  flash_count: number;
  energy: number;
  neighbors: Octopus[];
  time_step: () => void;
  energy_step: () => boolean;
}

class DumboOctopus implements Octopus {
  private flashed = false;
  private stepped = false;
  flash_count = 0;
  neighbors: Octopus[] = [];
  constructor(public energy: number) {}
  energy_step() {
    if (!this.stepped) {
      this.energy += 1;
      this.stepped = true;
    }
    if (!this.flashed && this.energy > 9) {
      this.flashed = true;
      for (const neighbor of this.neighbors) {
        neighbor.energy += 1;
      }
      return this.flashed;
    }
    return false;
  }

  time_step() {
    if (this.energy > 9) {
      this.energy = 0;
      this.flash_count += 1;
    }
    this.flashed = false;
    this.stepped = false;
  }
}

const octopodes_grid: Octopus[][] = raw_input.split("\n").map((line) =>
  line
    .trim()
    .split("")
    .map((x) => new DumboOctopus(parseInt(x)))
);
octopodes_grid.forEach((row, i) => {
  row.forEach((octopus, j) => {
    octopus.neighbors = [
      octopodes_grid[i - 1]?.[j - 1],
      octopodes_grid[i - 1]?.[j],
      octopodes_grid[i - 1]?.[j + 1],
      octopodes_grid[i]?.[j - 1],
      octopodes_grid[i]?.[j + 1],
      octopodes_grid[i + 1]?.[j - 1],
      octopodes_grid[i + 1]?.[j],
      octopodes_grid[i + 1]?.[j + 1],
    ].filter((x) => x !== undefined);
  });
});
const octopodes = octopodes_grid.flat();

function print_octopodes() {
  octopodes_grid.forEach((row) => {
    row.forEach((octopus) =>
      process.stdout.write(`${octopus.energy > 9 ? 0 : octopus.energy}`)
    );
    process.stdout.write("\n");
  });
}

let part_1 = 0;
let all_flashed = false;
let i = 0;
for (; !all_flashed; i++) {
  let done = false;
  do {
    done = !octopodes.some((octopus) => octopus.energy_step());
  } while (!done);
  octopodes.forEach((octopus) => octopus.time_step());
  if (i === 99) {
    part_1 = octopodes.reduce((sum, octopus) => sum + octopus.flash_count, 0);
  }
  all_flashed = octopodes.every((octopus) => octopus.energy === 0);
}
process.stdout.write(`Part 1: ${part_1}\n`);
process.stdout.write(`Part 2: ${i}\n`);
