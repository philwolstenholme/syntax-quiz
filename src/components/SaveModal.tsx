import { useState, useRef, useEffect } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Save, X, Check, Copy, Link } from "lucide-react";
import { SubtleButton } from "./SubtleButton";

interface SaveModalProps {
  onSave: () => string;
  disabled?: boolean;
}

export const SaveModal = ({ onSave, disabled }: SaveModalProps) => {
  const [saveUrl, setSaveUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(copiedTimerRef.current);
  }, []);

  const resetCopiedAfterDelay = () => {
    clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const url = onSave();
      setSaveUrl(url);
      setCopied(false);
    }
  };

  const handleCopy = async () => {
    if (!saveUrl) return;
    try {
      await navigator.clipboard.writeText(saveUrl);
      setCopied(true);
      resetCopiedAfterDelay();
    } catch {
      // Clipboard API unavailable — select the text so the user can copy manually
      const urlEl = document.querySelector<HTMLElement>("[data-save-url]");
      if (urlEl) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(urlEl);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger disabled={disabled} render={<SubtleButton />}>
        <Save size={16} aria-hidden="true" />
        <span className="hidden sm:inline text-sm">Save</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm opacity-0 data-open:opacity-100 transition-opacity duration-200 ease-out" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center p-4 z-[51] pointer-events-none">
          <Dialog.Popup className="pointer-events-auto w-full max-w-md rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[var(--bg)] opacity-0 scale-95 data-open:opacity-100 data-open:scale-100 transition-[opacity,transform] duration-200 ease-out origin-center">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <Dialog.Title className="font-medium text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
                Save progress
              </Dialog.Title>
              <Dialog.Close className="flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 touch-manipulation cursor-pointer">
                <X size={18} aria-hidden="true" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="p-6 pt-3">
              <Dialog.Description className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Copy this link to continue your quiz from where you left off.
              </Dialog.Description>

              {saveUrl && (
                <div className="space-y-3">
                  {/* URL display */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Link size={12} className="shrink-0 text-neutral-400" aria-hidden="true" />
                    <span
                      data-save-url
                      className="flex-1 text-xs text-neutral-600 dark:text-neutral-400 truncate font-mono min-w-0 select-all"
                    >
                      {saveUrl}
                    </span>
                  </div>

                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium text-xs transition-[color,background-color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] touch-manipulation cursor-pointer bg-neutral-900 text-neutral-100 hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white active:scale-[0.97]"
                  >
                    {copied ? (
                      <>
                        <Check size={18} aria-hidden="true" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} aria-hidden="true" />
                        Copy link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
