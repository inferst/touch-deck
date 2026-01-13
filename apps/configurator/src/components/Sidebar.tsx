import { DeckEditorSettings } from "@/components/DeckEditor/DeckSettings";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, useMemo } from "react";

export type SidebarProps = {
  isOpened: boolean;
};

export const Sidebar = memo((props: SidebarProps) => {
  useLogRenders("Sidebar");

  const { isOpened } = props;

  const width = useMemo(() => (isOpened ? "300px" : "0"), [isOpened]);

  return (
    <div
      className={cn(
        "absolute",
        "overflow-hidden",
        "border-l-2",
        "border-border",
        "bg-muted",
        "right-0",
        "top-0",
        "z-10",
        "h-screen",
        "w-(--width)",
        "transition-[left,right,width,display] duration-200 ease-linear",
      )}
      style={
        {
          "--width": width,
        } as React.CSSProperties
      }
    >
      <div className={cn("p-6", "overflow-hidden", "w-[300px]")}>
        <div className="mb-6">Deck Settings</div>
        <DeckEditorSettings />
      </div>
    </div>
  );
});
