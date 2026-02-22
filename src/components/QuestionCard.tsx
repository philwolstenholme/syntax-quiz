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
        <span key={key++} className={inHighlight ? 'bg-yellow-300' : undefined}>
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
        <span key={key++} className="bg-yellow-300 text-gray-900 font-bold">
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
      className="bg-white rounded-3xl shadow-xl p-8 mb-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-balance">
        {question.question}
      </h2>
      <p id="question-instructions" className="text-gray-600 mb-6 text-lg">
        💡 Drag an answer onto the code snippet or click an answer below
      </p>
      <div
        ref={setNodeRef}
        data-dropzone
        role="region"
        aria-label="Answer dropzone"
        aria-describedby="question-instructions"
        className={clsx(
          'relative rounded-xl overflow-hidden transition-transform transition-shadow duration-200',
          isOver && 'ring-4 ring-indigo-500 scale-[1.02]',
        )}
      >
        {isOver && (
          <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 flex items-center justify-center z-10">
            <span className="text-2xl font-bold text-indigo-600">
              Drop here! 🎯
            </span>
          </div>
        )}
        <pre className="bg-gray-900 p-6 rounded-xl overflow-x-auto text-base leading-relaxed">
          <code className="font-mono">
            <TokenizedCode tokenLines={tokenLines} hlRange={hlRange} />
          </code>
        </pre>
      </div>
    </div>
  );
};
