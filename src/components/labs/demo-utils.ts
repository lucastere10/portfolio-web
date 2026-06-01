"use client";

import { useEffect, useRef, useState } from "react";

export function useStepPlayback(stepCount: number, tickMs = 900) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!running) {
      return;
    }

    timerRef.current = setInterval(() => {
      setStep((prev) => {
        if (prev >= stepCount - 1) {
          setRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, tickMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [running, stepCount, tickMs]);

  function run() {
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setStep(0);
  }

  return { step, running, run, pause, reset, setStep };
}
