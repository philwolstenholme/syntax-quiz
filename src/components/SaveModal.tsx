import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Save, X, Check, Copy, Link } from 'lucide-react';
import { SubtleButton } from './SubtleButton';

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
        render={<SubtleButton />}
      >
        <Save size={16} aria-hidden="true" />
        <span className="hidden sm:inline text-sm">Save</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 data-open:opacity-100 transition-opacity duration-200" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
          <Dialog.Popup className="pointer-events-auto w-full max-w-md rounded-lg border border-neutral-800 bg-[#0a0a0a] opacity-0 scale-95 data-open:opacity-100 data-open:scale-100 transition-all duration-200 origin-center">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <Dialog.Title className="font-medium text-xl tracking-tight text-neutral-100">
                Save game
              </Dialog.Title>
              <Dialog.Close className="flex items-center justify-center w-7 h-7 rounded-md text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 touch-manipulation cursor-pointer">
                <X size={18} aria-hidden="true" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="p-6 pt-3">
              <Dialog.Description className="text-xs text-neutral-500 mb-4">
                Copy this link to continue your game later from exactly where you left off.
              </Dialog.Description>

              {saveUrl && (
                <div className="space-y-3">
                  {/* URL display */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800">
                    <Link size={12} className="shrink-0 text-neutral-500" aria-hidden="true" />
                    <span className="flex-1 text-xs text-neutral-400 truncate font-mono min-w-0 select-all">
                      {saveUrl}
                    </span>
                  </div>

                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium text-xs text-neutral-900 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] touch-manipulation cursor-pointer bg-neutral-100 hover:bg-white active:scale-[0.98]"
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
