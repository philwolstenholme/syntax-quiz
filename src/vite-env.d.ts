/// <reference types="vite/client" />

interface ShikiToken {
  content: string;
  color?: string;
  offset: number;
}

declare module 'virtual:tokens' {
  const darkTokenMap: Record<string, ShikiToken[][]>;
  const lightTokenMap: Record<string, ShikiToken[][]>;
  export { darkTokenMap, lightTokenMap };
}
