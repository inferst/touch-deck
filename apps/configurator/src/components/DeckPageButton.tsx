import { InstanceIdContext } from "@/components/Instance";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DialogDescription } from "@radix-ui/react-dialog";
import { DeckCellButton } from "@workspace/deck/components/NewDeck/DeckCellButton";
import {
  DeckForm,
  DeckFormData,
} from "@workspace/deck/components/NewDeck/DeckForm";
import { DeckButton } from "@workspace/deck/types/deck";
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
  id: number;
  width: number;
  height: number;
  button?: DeckButton;
  actions?: ComboboxItem[];
  onSave: (id: number, button: DeckButton) => void;
};

export function DeckPageButton(props: DeckPageButtonProps) {
  const { id, width, height, button = {}, actions, onSave } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleSave = (data: DeckFormData) => {
    onSave(id, {
      ...button,
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
        getInitialData: () => ({ type: "cell", id, instanceId }),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ id }),
        getIsSticky: () => false,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === "cell" &&
          source.data.id !== id,
        onDragEnter: () => setIsDragOver(true),
        onDragLeave: () => setIsDragOver(false),
        onDrop: () => setIsDragOver(false),
      }),
    );
  }, [instanceId, id]);

  const borderColor = useMemo(
    () => (isDragOver ? "#fff" : undefined),
    [isDragOver],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>
        <DeckCellButton
          ref={ref}
          id={id}
          text={button.title}
          icon={button.icon}
          backgroundColor={button.color}
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
          data={button}
          actions={actions}
          onSave={handleSave}
          onCancel={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
}
