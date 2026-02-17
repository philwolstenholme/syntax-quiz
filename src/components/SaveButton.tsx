import { useState, useEffect, useRef } from 'react';
import { Save, Check, Copy, Link } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface SaveButtonProps {
  onSave: () => string;
  disabled?: boolean;
  questionIndex: number;
}

export const SaveButton = ({ onSave, disabled, questionIndex }: SaveButtonProps) => {
  const [saveUrl, setSaveUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [prevQuestionIndex, setPrevQuestionIndex] = useState(questionIndex);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Dismiss the save confirmation when the question changes
  if (prevQuestionIndex !== questionIndex) {
    setPrevQuestionIndex(questionIndex);
    setSaveUrl(null);
    setCopied(false);
  }

  const handleSave = () => {
    const url = onSave();
    setSaveUrl(url);
    setCopied(false);
  };

  // Focus the confirmation element when it becomes visible
  useEffect(() => {
    if (saveUrl) {
      confirmationRef.current?.focus();
    }
  }, [saveUrl]);

  const handleCopy = async () => {
    if (!saveUrl) return;
    try {
      await navigator.clipboard.writeText(saveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = saveUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-8 mb-4">
      <button
        type="button"
        onClick={handleSave}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-600 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-colors transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-50 touch-manipulation"
      >
        <Save size={18} aria-hidden="true" />
        Save Progress
      </button>

      <AnimatePresence>
        {saveUrl && (
          <motion.div
            ref={confirmationRef}
            tabIndex={-1}
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 p-4 rounded-xl bg-green-50 border border-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50"
          >
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
              <Check size={18} aria-hidden="true" />
              Progress saved!
            </div>
            <p className="text-sm text-green-600 mb-3">
              Your progress has been saved to the URL. Copy it to continue later.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-green-200 text-sm text-gray-600 overflow-hidden">
                <Link size={14} className="shrink-0 text-green-500" aria-hidden="true" />
                <span className="truncate">{saveUrl}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50 touch-manipulation"
              >
                {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
