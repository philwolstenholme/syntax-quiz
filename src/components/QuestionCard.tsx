import { useMemo, useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import type { Question } from '../data/questions';
import { darkTokenMap, lightTokenMap } from 'virtual:tokens';
import { useTheme } from '../context/useTheme';
import { GlowEffect, type GlowData } from './GlowEffect';
import { WebGLNoise } from './WebGLNoise';

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
        <span key={key++} data-hl={inHighlight ? 'true' : undefined} className={inHighlight ? 'bg-yellow-400/30 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200' : undefined}>
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
        <span key={key++} data-hl="true" className="bg-yellow-400/30 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200">
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
  const { isOver, setNodeRef: setDropRef } = useDroppable({ id: 'dropzone' });
  const { resolvedTheme } = useTheme();
  // cardRef: the outer card — canvas lives here for room to spread
  const cardRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [glowData, setGlowData] = useState<GlowData | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const tokenMap = resolvedTheme === 'dark' ? darkTokenMap : lightTokenMap;
  const tokenLines = useMemo(() => tokenMap[code] ?? [], [tokenMap, code]);

  const hlRange = useMemo(() => {
    const start = code.indexOf(highlight);
    if (start === -1) return { start: 0, end: 0 };
    return { start, end: start + highlight.length };
  }, [code, highlight]);

  // Measure highlight spans relative to the card for WebGL
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const measure = () => {
      const spans = card.querySelectorAll<HTMLElement>('[data-hl="true"]');
      if (!spans.length) { setGlowData(null); return; }

      const cardRect = card.getBoundingClientRect();
      // Account for current scroll offset so glow coordinates are always
      // relative to the unscrolled position (scroll sync is handled separately)
      const scrollLeft = preRef.current?.scrollLeft ?? 0;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      spans.forEach((span) => {
        const r = span.getBoundingClientRect();
        minX = Math.min(minX, r.left - cardRect.left + scrollLeft);
        minY = Math.min(minY, r.top - cardRect.top);
        maxX = Math.max(maxX, r.right - cardRect.left + scrollLeft);
        maxY = Math.max(maxY, r.bottom - cardRect.top);
      });

      setGlowData({
        hlX: minX,
        hlY: minY,
        hlW: maxX - minX,
        hlH: maxY - minY,
        canvasW: cardRect.width,
        canvasH: cardRect.height,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    return () => ro.disconnect();
  }, [tokenLines, hlRange]);

  // Sync glow position with horizontal scroll of the code snippet.
  // Sets a CSS custom property on the card so GlowEffect can use calc().
  // WebGLNoise reads scrollLeft directly from preRef in its rAF loop.
  useEffect(() => {
    const pre = preRef.current;
    const card = cardRef.current;
    if (!pre || !card) return;

    const onScroll = () => {
      card.style.setProperty('--scroll-left', String(pre.scrollLeft));
    };

    pre.addEventListener('scroll', onScroll, { passive: true });
    return () => pre.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-lg border border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-900/50 p-5 sm:p-6 mb-4"
    >
      {glowData && (
        <div
          key={question.code}
          className="absolute inset-0 pointer-events-none"
          style={{ animation: 'glow-enter 1.4s ease-out forwards' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: isHovered ? 1 : 0.6,
              transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <GlowEffect {...glowData} isDark={resolvedTheme === 'dark'} />
            <WebGLNoise {...glowData} isDark={resolvedTheme === 'dark'} isHovered={isHovered} scrollElRef={preRef} />
          </div>
        </div>
      )}
      <h2 className="relative text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
        {question.question}
      </h2>
      <p id="question-instructions" className="relative text-neutral-500 dark:text-neutral-400 mb-4 text-sm">
        Focus on the highlighted part of the code. Drag an answer onto the code, tap an answer, or use the keyboard number shortcuts.
      </p>
      <div
        ref={setDropRef}
        data-dropzone
        role="region"
        aria-label="Code snippet — drop an answer here"
        aria-describedby="question-instructions"
        className={clsx(
          'relative rounded-md overflow-hidden transition-all duration-150',
          isOver && 'ring-1 ring-blue-500',
        )}
      >
        {isOver && (
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[5px] flex items-center justify-center z-10">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-neutral-900 border border-blue-200 dark:border-transparent rounded-full px-3 py-1">
              Drop here
            </span>
          </div>
        )}
        <pre ref={preRef} className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-md overflow-x-auto text-base leading-relaxed">
          <span className={clsx(
            'block transition-transform duration-150 ease-out origin-center',
            isOver && 'scale-[98%]'
          )}>
            <code className="font-mono text-neutral-700 dark:text-neutral-300">
            <TokenizedCode tokenLines={tokenLines} hlRange={hlRange} />
          </code>
          </span>
        </pre>
      </div>
    </div>
  );
};
