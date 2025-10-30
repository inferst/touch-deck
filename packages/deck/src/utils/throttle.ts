import { useEffect, useMemo, useRef } from "react";

export function throttle(fn: Function, limit: number) {
  let isThrottle = false;
  return (...args: unknown[]) => {
    if (!isThrottle) {
      isThrottle = true;
      setTimeout(() => {
        fn(...args);
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
    const func = () => {
      ref.current?.();
    };

    return throttle(func, limit);
  }, []);

  return throttledCallback;
}
