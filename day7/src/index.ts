import { readFile } from "fs/promises";
import * as tf from "@tensorflow/tfjs";

const raw_input = await readFile(process.argv[2], "utf8");
const crabs = raw_input.trim().split(",").map(Number);
const crab_v = tf.tensor1d(crabs);
const ones = tf.ones([crabs.length, 1]);
const y = tf.scalar(0).variable();
const f = (x: tf.Tensor) => x.sub(y.mul(ones).transpose()).abs();

const optimizer_1 = tf.train.sgd(0.1);
const loss = (x: tf.Tensor): tf.Scalar => f(x).sum();
for (let i = 0; i < 100; i++) {
  optimizer_1.minimize(() => loss(crab_v));
}
y.assign(tf.scalar(Math.round(y.dataSync()[0])));
console.log(`part 1: ${loss(crab_v).dataSync()[0]}`);

const loss_2 = (x: tf.Tensor): tf.Scalar =>
  f(x).mul(f(x).transpose().add(1).transpose()).div(2).sum();

y.assign(tf.scalar(0));
const optimizer_2 = tf.train.sgd(0.001);
for (let i = 0; i < 1000; i++) {
  optimizer_2.minimize(() => loss_2(crab_v));
}
y.assign(tf.scalar(Math.round(y.dataSync()[0])));
console.log(`part 2 (lossy): ${loss_2(crab_v).dataSync()[0]}`);

function exact_part_2(x: number): number {
  const s = (n: number): number => {
    return (n * (n + 1)) / 2;
  };
  return crabs.map((crab) => s(Math.abs(crab - x))).reduce((a, b) => a + b, 0);
}
console.log(`part 2 (exact): ${exact_part_2(y.dataSync()[0])}`);
