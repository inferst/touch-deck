import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { DeckButton } from "src/types/deck";

type DeckCellProps = {
  id: number;
  width: number;
  button?: DeckButton;
  onSave: (button: DeckButton) => void;
};

export function DeckCell(props: DeckCellProps) {
  const {
    id,
    width,
    button = {
      id,
      color: "#3c3c3c",
    },
    onSave,
  } = props;

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSave({
      ...button,
      color: event.target.value,
    });
  };

  const isNotEmpty = useMemo(() => {
    return button.startActionId || button.endActionId;
  }, [button]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          key={props.id}
          className={cn(
            "grow",
            "truncate",
            "m-[1.25%]",
            "rounded-[calc(10%)]",
            "flex",
            "items-center",
            "justify-center",
            "cursor-pointer",
            "relative",
            "w-[var(--width)]",
            "bg-[var(--color)]",
          )}
          style={
            {
              "--width": `${width}%`,
              "--color": `${button.color}`,
            } as React.CSSProperties
          }
        >
          {isNotEmpty ? (
            <>{id}</>
          ) : (
            <>
              <PlusIcon />
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Button Settings</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Input type="color" value={button.color} onChange={handleColorChange} />
      </DialogContent>
    </Dialog>
  );
}
