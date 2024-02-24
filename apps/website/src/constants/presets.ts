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
function fib(n: number): number {
  if (n === 0 || n === 1) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
}`,
        defaultParameters: [5],
    },

    {
        name: 'Fibonacci with memo',
        body: `// Fibonacci with memo
const memo = [];

function fib(n: number): number {
  if (n === 0 || n === 1) {
    return n;
  }

  if (memo[n] != null) {
    return memo[n];
  }

  return memo[n] = fib(n - 1) + fib(n - 2);
}`,
        defaultParameters: [5],
    },

    {
        name: '0/1 Knapsack',
        body: `// 0/1 Knapsack
const v = [100,70,50,10];
const w = [10,4,6,12];

function knap(i: number, s: number): number {
  if (s < 0) {
    return -Infinity;
  }

  if (i === v.length) {
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

    {
        name: 'LCS',
        body: `// LCS (Longest Common Subsequence)
const a = 'abcde';
const b = 'ace';

function lcs(i: number, j: number): number {
  if (i === a.length || j === b.length) {
    return 0;
  }

  if (a[i] == b[j]) {
    return 1 + lcs(i + 1, j + 1)
  }

  return Math.max(
    lcs(i + 1, j),
    lcs(i, j + 1)
  );
}
      `,
        defaultParameters: [0, 0],
    },

    {
        name: 'Climbing stairs',
        body: `// Climbing stairs
function climbStairs(n: number): number {
    if (n <= 2) {
        return n;
    }

    return climbStairs(n - 1) + climbStairs(n - 2);
};
      `,
        defaultParameters: [5],
    },

    {
        name: 'Unique Paths',
        body: `// Unique Paths
function uniquePaths(m: number, n: number): number {
    if (m < 1 || n < 1) {
        return 0;
    }

    if (m === 1 && n === 1) {
        return 1;
    }

    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
};
    `,
        defaultParameters: [2, 3],
    },
];
