import { Pages } from "@/components/Toolbar/Pages";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { SettingsIcon } from "lucide-react";
import { memo } from "react";

export type ToolbarProps = {
  selectedBoardId: number;
  onSelectedBoardChange: (id: number) => void;
  onSidebarToggle: () => void;
};

export const Toolbar = memo((props: ToolbarProps) => {
  useLogRenders("Toolbar");

  const { selectedBoardId, onSelectedBoardChange, onSidebarToggle } = props;

  return (
    <div
      className={cn(
        "absolute",
        "z-10",
        "flex",
        "flex-wrap",
        "p-4",
        "left-0",
        "right-0",
        "bg-muted",
        "border-b-2",
        "border-b-border",
      )}
    >
      <div className={cn("grow")}>
        <Pages
          selectedBoardId={selectedBoardId}
          onSelectedBoardChange={onSelectedBoardChange}
        />
      </div>
      <Button
        variant={"secondary"}
        size={"icon"}
        className={cn("mt-2")}
        onClick={onSidebarToggle}
      >
        <SettingsIcon />
      </Button>
    </div>
  );
});
