import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef } from "react";

type TauriRef = {
  onStreamerbotStatus: (status: string) => void;
};

const useTauri = () => {
  const ref = useRef<TauriRef>(null);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
