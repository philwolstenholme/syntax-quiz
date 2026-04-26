import { Dialog } from "@base-ui/react/dialog";
import { BookOpen, X } from "lucide-react";
import type { QuestionWithIndex } from "../hooks/types";
import { SubtleButton } from "./SubtleButton";

interface CheatsheetModalProps {
  missedQuestions: QuestionWithIndex[];
}

const ExplanationWithCode = ({ text }: { text: string }) => {
  const parts = text.split(/`([^`]+)`/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={part}
            className="font-mono text-[0.85em] bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded"
          >
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
};

const HighlightedCode = ({ code, highlight }: { code: string; highlight: string }) => {
  const start = code.indexOf(highlight);
  if (start === -1) {
    return <span className="text-neutral-700 dark:text-neutral-300">{code}</span>;
  }
  const before = code.slice(0, start);
  const after = code.slice(start + highlight.length);
  return (
    <>
      <span className="text-neutral-700 dark:text-neutral-300">{before}</span>
      <mark className="bg-yellow-400/30 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 rounded-sm not-italic">
        {highlight}
      </mark>
      <span className="text-neutral-700 dark:text-neutral-300">{after}</span>
    </>
  );
};

const CheatsheetItem = ({ question }: { question: QuestionWithIndex }) => (
  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col gap-3">
    <pre className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md p-3 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">
      <HighlightedCode code={question.code} highlight={question.highlight} />
    </pre>
    <div>
      <span className="inline-block text-xs font-semibold font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
        Answer
      </span>
      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {question.correct}
      </p>
    </div>
    {question.explanation && (
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <ExplanationWithCode text={question.explanation} />
      </p>
    )}
  </div>
);

export const CheatsheetModal = ({ missedQuestions }: CheatsheetModalProps) => {
  if (missedQuestions.length === 0) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <SubtleButton className="w-full justify-center border border-neutral-300 dark:border-neutral-800 py-2" />
        }
      >
        <BookOpen size={16} aria-hidden="true" />
        Review {missedQuestions.length} missed {missedQuestions.length === 1 ? "answer" : "answers"}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm opacity-0 data-open:opacity-100 transition-opacity duration-200 ease-out" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center p-4 z-[51] pointer-events-none overflow-y-auto">
          <Dialog.Popup className="pointer-events-auto w-full max-w-3xl rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[var(--bg)] opacity-0 scale-95 data-open:opacity-100 data-open:scale-100 transition-[opacity,transform] duration-200 ease-out origin-center my-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <Dialog.Title className="font-medium text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
                Missed answers
              </Dialog.Title>
              <Dialog.Close className="flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 touch-manipulation cursor-pointer">
                <X size={18} aria-hidden="true" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="p-6 pt-3">
              <Dialog.Description className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
                Here are the questions you got wrong, with the correct answers and explanations.
              </Dialog.Description>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {missedQuestions.map((q) => (
                  <CheatsheetItem key={q.originalIndex} question={q} />
                ))}
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
