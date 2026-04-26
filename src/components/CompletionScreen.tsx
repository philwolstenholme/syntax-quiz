import { useEffect, useRef } from "react";
import { Trophy, ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { m, useReducedMotion } from "motion/react";
import { PageLayout } from "./PageLayout";
import { CRTBackground } from "./CRTBackground";
import { CheatsheetModal } from "./CheatsheetModal";
import { completionButtonClass } from "./CompletionButton";
import type { Level } from "../data/questions";
import type { QuestionWithIndex } from "../hooks/types";
import { ROUTES } from "../routes";
import { formatNumber, formatPercent } from "../utils/format";
import { useCountUp } from "../hooks/useCountUp";

interface CompletionScreenProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  level: Level;
  flawless: boolean;
  missedQuestions: QuestionWithIndex[];
}

export const CompletionScreen = ({
  score,
  correctAnswers,
  totalQuestions,
  level,
  flawless,
  missedQuestions,
}: CompletionScreenProps) => {
  const animatedScore = useCountUp(score, 1000);
  const animatedCorrect = useCountUp(correctAnswers, 800);
  const isPerfect = flawless;
  const accuracy = formatPercent(correctAnswers / totalQuestions);
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPerfect || prefersReducedMotion) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#00ff88", "#00cc6a", "#00e87a", "#33ffaa", "#00ff88"],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#00ff88", "#00cc6a", "#00e87a", "#33ffaa", "#00ff88"],
      });
    }, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isPerfect, prefersReducedMotion]);

  const stagger = (i: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] as const },
        };

  return (
    <PageLayout centered>
      <CRTBackground excludeStartRef={wrapperRef} />
      <div
        ref={wrapperRef}
        className="score-wrapper relative p-8 sm:p-10 max-w-md w-full text-center"
      >
        {/* Trophy with CRT glow */}
        <m.div className="relative mb-6 flex items-center justify-center" {...stagger(0)}>
          {/* Pulsating lime green glow */}
          <div
            aria-hidden="true"
            className="absolute w-24 h-24 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,255,136,0.7) 0%, rgba(0,255,136,0.2) 50%, transparent 75%)",
              filter: "blur(16px)",
              animation: prefersReducedMotion
                ? undefined
                : "trophy-glow-pulse 2.4s ease-in-out infinite",
            }}
          />
          <Trophy
            className="relative w-12 h-12 text-neutral-900 dark:text-white drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]"
            aria-hidden="true"
          />
        </m.div>

        <m.h1
          className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2"
          {...stagger(1)}
        >
          {isPerfect ? "Flawless." : "Quiz complete!"}
        </m.h1>

        <m.div className="mb-8" {...stagger(2)}>
          <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
            {level.name} — {level.subtitle}
          </span>
        </m.div>

        {/* Score — borderless, just the number */}
        <m.div className="mb-6" {...stagger(3)}>
          <div className="text-5xl font-semibold tabular-nums font-mono text-neutral-900 dark:text-neutral-100 mb-1">
            {formatNumber(animatedScore)}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-widest">
            Total score
          </div>
        </m.div>

        {/* Divider */}
        <m.div
          className="border-t border-neutral-400/30 dark:border-neutral-600/40 mb-6"
          {...stagger(4)}
        />

        {/* Stats — borderless, inline */}
        <m.div className="grid grid-cols-2 gap-0 mb-8" {...stagger(5)}>
          <div className="py-2 px-4">
            <div className="text-2xl font-semibold tabular-nums font-mono text-neutral-900 dark:text-neutral-100 mb-0.5">
              {accuracy}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
              Accuracy
            </div>
          </div>
          <div className="py-2 px-4 border-l border-neutral-400/30 dark:border-neutral-600/40">
            <div className="text-2xl font-semibold tabular-nums font-mono text-neutral-900 dark:text-neutral-100 mb-0.5">
              {formatNumber(animatedCorrect)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
              Correct
            </div>
          </div>
        </m.div>

        <m.div className="space-y-3" {...stagger(6)}>
          {missedQuestions.length > 0 && <CheatsheetModal missedQuestions={missedQuestions} />}

          <Link
            to={ROUTES.questions(level.id)}
            className={completionButtonClass(missedQuestions.length > 0 ? "secondary" : "primary")}
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            Try again
          </Link>

          <Link to={ROUTES.home} className={completionButtonClass("secondary")}>
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Choose another level
          </Link>
        </m.div>
      </div>
    </PageLayout>
  );
};
