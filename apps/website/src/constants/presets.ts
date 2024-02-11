export const Presets = [
    {
        name: 'Fibonacci',
        body: `// Fibonacci
function fib(n: number) {
  if (n == 0 || n == 1)
    return n;

  return fib(n - 1) + fib(n - 2);
}
        `,
    },
];
