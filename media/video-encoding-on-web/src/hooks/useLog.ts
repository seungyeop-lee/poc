import {useCallback, useRef} from "react";

export default function useLog() {
  const messageRef = useRef<HTMLSpanElement | null>(null);
  const logDivRef = useRef<HTMLDivElement | null>(null);

  const log = useCallback((message: string) => {
    if (!messageRef.current) return;
    messageRef.current.innerText += `${message}\n`;
    if (!logDivRef.current) return;
    logDivRef.current.scrollTop = logDivRef.current.scrollHeight;
  }, []);

  return {
    logDivRef,
    messageRef,
    log,
  };
}
