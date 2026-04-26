import { useMemo, type ReactNode } from "react";
import { darkTokenMap, lightTokenMap } from "virtual:tokens";
import { useTheme } from "../context/useTheme";

const TokenizedCodeRaw = ({
  tokenLines,
  hlRange,
}: {
  tokenLines: ShikiToken[][];
  hlRange: { start: number; end: number };
}) => {
  const elements: ReactNode[] = [];
  let key = 0;

  for (let lineIdx = 0; lineIdx < tokenLines.length; lineIdx++) {
    const line = tokenLines[lineIdx]!;

    if (lineIdx > 0) {
      const prevLine = tokenLines[lineIdx - 1]!;
      const lastToken = prevLine[prevLine.length - 1];
      const nlOffset = lastToken ? lastToken.offset + lastToken.content.length : 0;
      const inHighlight = nlOffset >= hlRange.start && nlOffset < hlRange.end;
      elements.push(
        <span
          key={key++}
          data-hl={inHighlight ? "true" : undefined}
          className={
            inHighlight
              ? "bg-yellow-400/30 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200"
              : undefined
          }
        >
          {"\n"}
        </span>,
      );
    }

    for (const token of line) {
      const tokenStart = token.offset;
      const tokenEnd = tokenStart + token.content.length;

      if (tokenEnd <= hlRange.start || tokenStart >= hlRange.end) {
        elements.push(
          <span key={key++} style={{ color: token.color }}>
            {token.content}
          </span>,
        );
        continue;
      }

      if (tokenStart < hlRange.start) {
        elements.push(
          <span key={key++} style={{ color: token.color }}>
            {token.content.substring(0, hlRange.start - tokenStart)}
          </span>,
        );
      }

      const hlStart = Math.max(0, hlRange.start - tokenStart);
      const hlEnd = Math.min(token.content.length, hlRange.end - tokenStart);
      elements.push(
        <span
          key={key++}
          data-hl="true"
          className="bg-yellow-400/30 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200"
        >
          {token.content.substring(hlStart, hlEnd)}
        </span>,
      );

      if (tokenEnd > hlRange.end) {
        elements.push(
          <span key={key++} style={{ color: token.color }}>
            {token.content.substring(hlRange.end - tokenStart)}
          </span>,
        );
      }
    }
  }

  return <>{elements}</>;
};

interface TokenizedCodeProps {
  code: string;
  highlight: string;
}

export const TokenizedCode = ({ code, highlight }: TokenizedCodeProps) => {
  const { resolvedTheme } = useTheme();
  const tokenMap = resolvedTheme === "dark" ? darkTokenMap : lightTokenMap;
  const tokenLines = useMemo(() => tokenMap[code] ?? [], [tokenMap, code]);

  const hlRange = useMemo(() => {
    const start = code.indexOf(highlight);
    if (start === -1) return { start: 0, end: 0 };
    return { start, end: start + highlight.length };
  }, [code, highlight]);

  return <TokenizedCodeRaw tokenLines={tokenLines} hlRange={hlRange} />;
};
