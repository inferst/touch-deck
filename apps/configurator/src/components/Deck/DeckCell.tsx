import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type DeckCellProps = {
  id: number;
};

export function DeckCell(props: DeckCellProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          key={props.id}
          className="truncate aspect-square rounded-[calc(10%)] flex items-center justify-center bg-amber-400 cursor-pointer"
        >
          {props.id}
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
