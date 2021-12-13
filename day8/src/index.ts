import { readFile } from "fs/promises";

const raw_input = await readFile(process.argv[2], "utf8");
const unique_lengths: [number, number, number, number] = [2, 3, 4, 7];
const control_codes = raw_input
  .split("\n")
  .map((line) => line.trim())
  .map((line) => {
    return line
      .split(" | ")[1]
      .split(" ")
      .filter((x) => unique_lengths.indexOf(x.length) >= 0).length;
  })
  .reduce((acc, curr) => {
    return acc + curr;
  }, 0);
console.log(`Part 1: ${control_codes}`);

// part 2

const letter_lookup: { [key: string]: number } = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
};

const segment_lookup: { [key: number]: string[] } = {
  0: ["a", "b", "c", "e", "f", "g"],
  1: ["c", "f"],
  2: ["a", "c", "d", "e", "g"],
  3: ["a", "c", "d", "f", "g"],
  4: ["b", "c", "d", "f"],
  5: ["a", "b", "d", "f", "g"],
  6: ["a", "b", "d", "e", "f", "g"],
  7: ["a", "c", "f"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const stringPermutations = (str: string): string[] => {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str
    .split("")
    .reduce(
      (acc: string[], letter, i): string[] =>
        acc.concat(
          stringPermutations(str.slice(0, i) + str.slice(i + 1)).map(
            (val) => letter + val
          )
        ),
      []
    );
};
const my_permuations = stringPermutations("abcdefgh");

function get_digit_set(permutation: string): Set<Set<string>> {
  const digit_set: Set<Set<string>> = new Set();
  const segments = permutation.split("");
  for (const number in Object.keys(segment_lookup)) {
    const single_set: Set<string> = new Set();
    for (const letter of segment_lookup[number]) {
      single_set.add(segments[letter_lookup[letter]]);
    }
    digit_set.add(single_set);
  }

  return digit_set;
}

function compare_sets(a: Set<Set<string>>, b: Set<Set<string>>): boolean {
  const results = [...a].every((x) => {
    const q = [...b].some((z) => {
      const p = z.size === x.size && [...x].every((y) => z.has(y));
      return p;
    });
    return q;
  });

  return results;
}

const number_map = "abcdefg";

function get_number(code: string, permutation: string): string {
  const segments = new Set(
    code.split("").map((x) => number_map[permutation.indexOf(x)])
  );
  for (const digit in segment_lookup) {
    const comparison_set = new Set(segment_lookup[digit]);
    if (
      comparison_set.size == segments.size &&
      [...segments].every((x) => comparison_set.has(x))
    ) {
      return digit;
    }
  }
  return "";
}

const part_2 = raw_input
  .split("\n")
  .map((line) => line.trim())
  .map((line) => {
    const digits: Set<Set<string>> = new Set();
    line
      .split(" | ")[0]
      .split(" ")
      .forEach((x) => {
        digits.add(new Set(x.split("")));
      });
    const correct_permutation = my_permuations.filter((perm) =>
      compare_sets(get_digit_set(perm), digits)
    );
    const control_codes = line.split(" | ")[1].split(" ");
    const control_number = parseInt(
      control_codes
        .map((code) => get_number(code, correct_permutation[0]))
        .join("")
    );
    return control_number;
  })
  .reduce((acc, curr) => acc + curr, 0);
console.log(`Part 2: ${part_2}`);
