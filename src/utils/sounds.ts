import { tiks } from "@rexa-developer/tiks";
import { vibrateCorrect, vibrateIncorrect, vibrateKeycap, vibratePop } from "./vibrate";

const MUTE_KEY = "syntax-quiz-muted";
let _muted = typeof localStorage !== "undefined" && localStorage.getItem(MUTE_KEY) === "true";

let _initialized = false;
function ensureInit(): void {
  if (_initialized) return;
  _initialized = true;
  tiks.init({ respectReducedMotion: true, volume: 0.5, muted: _muted });
}

export function isMuted(): boolean {
  return _muted;
}
export function setMuted(v: boolean): void {
  _muted = v;
  if (typeof localStorage !== "undefined") localStorage.setItem(MUTE_KEY, String(v));
  if (_initialized) {
    if (v) tiks.mute();
    else tiks.unmute();
  }
}

export const playKeycapSound = (): void => {
  ensureInit();
  vibrateKeycap();
  tiks.click();
};
const playPopSound = (): void => {
  ensureInit();
  vibratePop();
  tiks.pop();
};
export const playCorrectSound = (): void => {
  ensureInit();
  vibrateCorrect();
  tiks.success();
};
export const playIncorrectSound = (): void => {
  ensureInit();
  vibrateIncorrect();
  tiks.error();
};

// ─── Global keycap sound on any interactive element ───────────────────────────

function isInteractive(el: Element): boolean {
  const tag = el.tagName;
  if (tag === "BUTTON") return !(el as HTMLButtonElement).disabled;
  if (tag === "A") return (el as HTMLAnchorElement).href.length > 0;
  if (tag === "INPUT") {
    const input = el as HTMLInputElement;
    return !input.disabled && input.type !== "hidden";
  }
  if (tag === "SELECT") return !(el as HTMLSelectElement).disabled;
  if (tag === "TEXTAREA") return !(el as HTMLTextAreaElement).disabled;
  const role = el.getAttribute("role");
  if (role && ["button", "link", "tab", "menuitem", "option"].includes(role)) {
    return el.getAttribute("aria-disabled") !== "true";
  }
  return false;
}

if (typeof document !== "undefined") {
  // Pointer: walk from the touch/click target up to the nearest interactive ancestor.
  document.addEventListener(
    "pointerdown",
    (e: PointerEvent) => {
      let el = e.target as Element | null;
      while (el && el !== document.documentElement) {
        if (isInteractive(el)) {
          const sound = (el as HTMLElement).dataset?.sound;
          if (sound === "pop") playPopSound();
          else playKeycapSound();
          return;
        }
        el = el.parentElement;
      }
    },
    { passive: true },
  );

  // Keyboard: Space/Enter activate buttons and links — but not text entry in inputs/textareas.
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== " " && e.key !== "Enter") return;
    const focused = document.activeElement;
    if (!focused) return;
    const tag = focused.tagName;
    if (tag === "TEXTAREA") return;
    if (tag === "INPUT") {
      const type = (focused as HTMLInputElement).type;
      if (!["button", "submit", "reset", "checkbox", "radio"].includes(type)) return;
    }
    if (isInteractive(focused)) {
      const sound = (focused as HTMLElement).dataset?.sound;
      if (sound === "pop") playPopSound();
      else playKeycapSound();
    }
  });
}
