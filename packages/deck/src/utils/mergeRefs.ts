import { RefCallback, RefObject } from "react";

export function mergeRefs<T>(
  ...refs: (RefObject<T> | RefCallback<T> | undefined)[]
) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        ref.current = node;
      }
    });
  };
}
