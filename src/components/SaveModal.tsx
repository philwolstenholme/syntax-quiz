import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Save, X, Check, Copy, Link } from 'lucide-react';

interface SaveModalProps {
  onSave: () => string;
  disabled?: boolean;
}

export const SaveModal = ({ onSave, disabled }: SaveModalProps) => {
  const [saveUrl, setSaveUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        disabled={disabled}
        className="flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-xl border-2 border-indigo-200 bg-white text-indigo-600 font-bold hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 touch-manipulation cursor-pointer"
      >
        <Save size={16} aria-hidden="true" />
        <span className="hidden sm:inline text-sm">Save</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm opacity-0 data-[open]:opacity-100 transition-opacity duration-200" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
          <Dialog.Popup className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl opacity-0 scale-95 data-[open]:opacity-100 data-[open]:scale-100 transition-all duration-200 origin-center">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <Dialog.Title className="text-xl font-bold text-gray-800">
                Save game
              </Dialog.Title>
              <Dialog.Close className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 touch-manipulation cursor-pointer">
                <X size={18} aria-hidden="true" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="p-6 pt-3">
              <Dialog.Description className="text-sm text-gray-500 mb-5">
                Copy this link to continue your game later from exactly where you left off.
              </Dialog.Description>

              {saveUrl && (
                <div className="space-y-3">
                  {/* URL display */}
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                    <Link size={14} className="shrink-0 text-indigo-400" aria-hidden="true" />
                    <span className="flex-1 text-xs text-gray-600 truncate font-mono min-w-0 select-all">
                      {saveUrl}
                    </span>
                  </div>

                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 touch-manipulation cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98]"
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

                  {/* Divider + open link */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <a
                    href={saveUrl}
                    className="block w-full text-center text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg py-1 touch-manipulation"
                  >
                    Open save link
                  </a>
                </div>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
