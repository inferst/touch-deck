import { cn } from "@workspace/ui/lib/utils";
import { Loader2Icon } from "lucide-react";
import { memo } from "react";

export const Loader = memo(() => {
  return (
    <div className="flex justify-center items-center h-full">
      <Loader2Icon className={cn("size-8 animate-spin")} />
    </div>
  );
});
