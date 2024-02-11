/* eslint-disable @typescript-eslint/no-explicit-any */
type Preset = {
    name: string;
    body: string;
    defaultParameters: any[];
};

export const Presets: Preset[] = [
    {
        name: 'Fibonacci',
        body: `// Fibonacci
function fib(n: number) {
  if (n == 0 || n == 1) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
}`,
        defaultParameters: [5],
    },
    {
        name: '0/1 Knapsack',
        body: `// 0/1 Knapsack
const v = [100,70,50,10];
const w = [10,4,6,12];

function knap(i: number, s: number) {
  if (s < 0) {
    return -Infinity;
  }

  if (i == v.length) {
    return 0;
  }
  
  return Math.max(
    knap(i + 1, s),
    v[i] + knap(i + 1, s - w[i])
  );
}
        `,
        defaultParameters: [0, 12],
    },
];
