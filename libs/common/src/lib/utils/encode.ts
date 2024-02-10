import { isBrowser } from './platform';

export function encode(obj: object) {
    const str = JSON.stringify(obj);
    const base64 = isBrowser()
        ? btoa(str)
        : Buffer.from(str, 'utf-8').toString('base64');
    const encoded = encodeURIComponent(base64);
    return encoded;
}

export function decode(encoded: string): object {
    const decodedUri = decodeURIComponent(encoded);
    const decoded = isBrowser()
        ? atob(decodedUri)
        : Buffer.from(decodedUri, 'base64').toString('utf-8');
    return JSON.parse(decoded);
}
