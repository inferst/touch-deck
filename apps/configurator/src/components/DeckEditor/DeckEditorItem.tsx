import { DeckEditorItemType } from "@/components/DeckEditor/DeckEditorItemType";
import { InstanceIdContext } from "@/components/Instance";
import { useSettingsContext } from "@/context/SettingsContext";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DeckCell } from "@workspace/deck/components/DeckCell";
import { Cell } from "@workspace/deck/types/board";
import {
  FullscreenDialog,
  FullscreenDialogContent,
  FullscreenDialogDescription,
  FullscreenDialogHeader,
  FullscreenDialogTitle,
  FullscreenDialogTrigger,
} from "@workspace/ui/components/fullscreen-dialog";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";

export type DeckEditorItemProps = {
  cell: Cell;
  onSave: (cell: Cell) => void;
};

export const DeckEditorItem = memo((props: DeckEditorItemProps) => {
  const { cell, onSave } = props;

  const settings = useSettingsContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleSave = (data: Cell) => {
    onSave({
      ...cell,
      ...data,
    });

    setIsOpen(false);
  };

  const instanceId = useContext(InstanceIdContext);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      throw Error("No element");
    }

    return combine(
      draggable({
        element: element,
        getInitialData: () => ({ type: "cell", id: cell.id, instanceId }),
      }),
      dropTargetForElements({
        element: element,
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
    () => (isDragOver ? "#ccc" : undefined),
    [isDragOver],
  );

  console.log("DeckEditorItemForm render");

  return (
    <FullscreenDialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <FullscreenDialogTrigger asChild>
        <DeckCell
          ref={ref}
          text={cell?.title?.title}
          icon={cell?.icon?.icon}
          backgroundColor={cell?.background?.color}
          borderColor={borderColor}
          borderRadius={settings.style.borderRadius}
        />
      </FullscreenDialogTrigger>
      <FullscreenDialogContent>
        <FullscreenDialogHeader className="h-[26px]">
          <FullscreenDialogTitle>Button Settings</FullscreenDialogTitle>
          <FullscreenDialogDescription></FullscreenDialogDescription>
        </FullscreenDialogHeader>
        <div className="h-[calc(100%-26px)]">
          <DeckEditorItemType
            cell={cell}
            onSave={handleSave}
            onCancel={() => {}}
          />
        </div>
      </FullscreenDialogContent>
    </FullscreenDialog>
  );
});
