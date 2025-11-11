import { useDebounce } from "@workspace/utils/debounce";
import { useCallback, useEffect, useId, useRef } from "react";

export function useLogRenders(componentName: string) {
  const renderCount = useRef(0);
  const freshRenderCount = useRef(0);

  const id = useId();

  const debug = useCallback(() => {
    console.debug(`${componentName} [${id}] rendered`, {
      count: renderCount.current,
      freshCount: freshRenderCount.current,
    });

    freshRenderCount.current = 0;
  }, [id, renderCount, componentName]);

  const debouncedDebug = useDebounce(debug, 100);

  useEffect(() => {
    renderCount.current += 1;
    freshRenderCount.current += 1;
    debouncedDebug();
  });
}
