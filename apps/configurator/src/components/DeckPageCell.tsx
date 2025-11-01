import { InstanceIdContext } from "@/components/Instance";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DialogDescription } from "@radix-ui/react-dialog";
import { DeckCell } from "@workspace/deck/components/DeckCell";
import { DeckForm, DeckFormData } from "@workspace/deck/components/DeckForm";
import { Cell } from "@workspace/deck/types";
import { ComboboxItem } from "@workspace/ui/components/Combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

type DeckPageButtonProps = {
  width: number;
  height: number;
  cell: Cell;
  actions?: ComboboxItem[];
  onSave: (cell: Cell) => void;
};

export function DeckPageCell(props: DeckPageButtonProps) {
  const { width, height, cell, actions, onSave } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleSave = (data: DeckFormData) => {
    onSave({
      ...cell,
      ...data,
    });

    setIsOpen(false);
  };

  const instanceId = useContext(InstanceIdContext);

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      throw Error("No element");
    }

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: "cell", id: cell.id, instanceId }),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ id: cell.id }),
        getIsSticky: () => false,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === "cell" &&
          source.data.id !== cell.id,
        onDragEnter: () => setIsDragOver(true),
        onDragLeave: () => setIsDragOver(false),
        onDrop: () => setIsDragOver(false),
      }),
    );
  }, [instanceId, cell.id]);

  const borderColor = useMemo(
    () => (isDragOver ? "#fff" : undefined),
    [isDragOver],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>
        <DeckCell
          ref={ref}
          text={cell?.title}
          icon={cell?.icon}
          backgroundColor={cell?.color}
          borderColor={borderColor}
          width={width}
          height={height}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Button Settings</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DeckForm
          data={cell}
          actions={actions}
          onSave={handleSave}
          onCancel={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
}
