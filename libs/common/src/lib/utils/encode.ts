export function encode(obj: object) {
  const str = JSON.stringify(obj);
  const encoded = encodeURIComponent(
    Buffer.from(str, 'utf-8').toString('base64')
  );
  return encoded;
}

export function decode(encoded: string): object {
  const decoded = Buffer.from(decodeURIComponent(encoded), 'base64').toString(
    'utf-8'
  );
  return JSON.parse(decoded);
}
