/// <reference types="vite/client" />

declare module 'virtual:tokens' {
  const tokenMap: Record<
    string,
    Array<Array<{ content: string; color?: string; offset: number }>>
  >;
  export default tokenMap;
}
