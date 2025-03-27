import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";

type DeckCellProps = {
  id: number;
  width: number;
};

export function DeckCell(props: DeckCellProps) {
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
            "bg-amber-400",
            "cursor-pointer",
            "relative",
            "w-[var(--width)]",
          )}
          style={{ "--width": `${props.width}%` } as React.CSSProperties}
        >
          <div className="w-max">{props.id}</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
