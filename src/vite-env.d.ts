/// <reference types="vite/client" />

interface ShikiToken {
  content: string;
  color?: string;
  offset: number;
}

declare module 'virtual:tokens' {
  const tokenMap: Record<string, ShikiToken[][]>;
  export default tokenMap;
}
