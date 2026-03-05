import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import type { Question } from '../data/questions';
import tokenMap from 'virtual:tokens';

interface QuestionCardProps {
  question: Question;
}

const TokenizedCode = ({
  tokenLines,
  hlRange,
}: {
  tokenLines: ShikiToken[][];
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

  const tokenLines = useMemo(() => tokenMap[code] ?? [], [code]);

  const hlRange = useMemo(() => {
    const start = code.indexOf(highlight);
    if (start === -1) return { start: 0, end: 0 };
    return { start, end: start + highlight.length };
  }, [code, highlight]);

  return (
    <div
      className="rounded-lg border border-line bg-surface-card p-5 sm:p-6 mb-4"
    >
      <h2 className="text-xl font-medium tracking-tight text-heading mb-2">
        {question.question}
      </h2>
      <p id="question-instructions" className="text-muted mb-4 text-base">
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
            <span className="text-sm font-medium text-dropzone-pill-text bg-dropzone-pill-bg rounded-full px-3 py-1">
              Drop here
            </span>
          </div>
        )}
        <pre className="bg-[#0a0a0a] border border-[#262626] p-4 rounded-md overflow-x-auto text-base leading-relaxed">
          <div className={clsx(
            'transition-transform duration-150 ease-out origin-center',
            isOver && 'scale-[98%]'
          )}>
            <code className="font-mono text-[#d4d4d4]">
            <TokenizedCode tokenLines={tokenLines} hlRange={hlRange} />
          </code>
          </div>
        </pre>
      </div>
    </div>
  );
};
