import { useState, useCallback } from "react";
import { isMuted, setMuted } from "../utils/sounds";

export function useMute() {
  const [muted, setMutedState] = useState(isMuted);

  const toggleMute = useCallback(() => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  }, []);

  return { muted, toggleMute };
}
