import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import type { Question } from '../data/questions';
import tokenMap from 'virtual:tokens';

interface Token {
  content: string;
  color?: string;
  offset: number;
}

interface QuestionCardProps {
  question: Question;
}

const typedTokenMap = tokenMap as Record<string, Token[][]>;

const TokenizedCode = ({
  tokenLines,
  hlRange,
}: {
  tokenLines: Token[][];
  hlRange: { start: number; end: number };
}) => {
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let lineIdx = 0; lineIdx < tokenLines.length; lineIdx++) {
    const line = tokenLines[lineIdx]!;

    if (lineIdx > 0) {
      const prevLine = tokenLines[lineIdx - 1]!;
      const lastToken = prevLine[prevLine.length - 1];
      const nlOffset = lastToken ? lastToken.offset + lastToken.content.length : 0;
      const inHighlight = nlOffset >= hlRange.start && nlOffset < hlRange.end;
      elements.push(
        <span key={key++} className={inHighlight ? 'bg-yellow-500/20 text-yellow-200' : undefined}>
          {'\n'}
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
        <span key={key++} className="bg-yellow-500/20 text-yellow-200">
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

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const { code, highlight } = question;
  const { isOver, setNodeRef } = useDroppable({ id: 'dropzone' });

  const tokenLines = useMemo(() => typedTokenMap[code] ?? [], [code]);

  const hlRange = useMemo(() => {
    const start = code.indexOf(highlight);
    if (start === -1) return { start: 0, end: 0 };
    return { start, end: start + highlight.length };
  }, [code, highlight]);

  return (
    <div
      className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6 mb-4"
    >
      <h2 className="text-xl font-medium tracking-tight text-neutral-100 mb-2">
        {question.question}
      </h2>
      <p id="question-instructions" className="text-neutral-500 mb-4 text-base">
        Drag an answer onto the code or click to select
      </p>
      <div
        ref={setNodeRef}
        data-dropzone
        role="region"
        aria-label="Answer dropzone"
        aria-describedby="question-instructions"
        className={clsx(
          'relative rounded-md overflow-hidden transition-all duration-150',
          isOver && 'ring-1 ring-blue-500',
        )}
      >
        {isOver && (
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[5px] flex items-center justify-center z-10">
            <span className="text-sm font-medium text-blue-400 bg-slate-900 rounded-full px-3 py-1">
              Drop here
            </span>
          </div>
        )}
        <pre className="bg-neutral-950 border border-neutral-800 p-4 rounded-md overflow-x-auto text-base leading-relaxed">
          <div className={clsx(
            isOver && 'scale-[98%] origin-center transition-transform'
          )}>
            <code className="font-mono text-neutral-300">
            <TokenizedCode tokenLines={tokenLines} hlRange={hlRange} />
          </code>
          </div>
        </pre>
      </div>
    </div>
  );
};
