import { useEffect, useMemo, useRef } from "react";

export function debounce(fn: Function, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function useDebounce(fn: Function, limit: number) {
  const ref = useRef<Function | null>(null);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: any[]) => {
      ref.current?.(...args);
    };

    return debounce(func, limit);
  }, []);

  return debouncedCallback;
}

