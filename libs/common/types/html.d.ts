// vite
declare module '*.html?raw' {
    const value: string;
    export default value;
}

declare module '*.html' {
    const value: string;
    export default value;
}
