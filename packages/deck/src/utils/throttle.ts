import { useEffect, useMemo, useRef } from "react";

export function throttle(fn: Function, limit: number) {
  let isThrottle = false;
  let latestArgs: unknown[];
  return (...args: unknown[]) => {
    latestArgs = args;
    if (!isThrottle) {
      isThrottle = true;
      setTimeout(() => {
        fn(...latestArgs);
        isThrottle = false;
      }, limit);
    }
  };
}

export function useThrottle(fn: Function, limit: number) {
  const ref = useRef<Function | null>(null);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  const throttledCallback = useMemo(() => {
    const func = (...args: any[]) => {
      ref.current?.(...args);
    };

    return throttle(func, limit);
  }, []);

  return throttledCallback;
}
