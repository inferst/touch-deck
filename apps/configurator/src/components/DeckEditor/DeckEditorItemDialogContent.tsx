import { DeckEditorItemForm } from "@/components/DeckEditor/DeckEditorItemForm";
import {
  DeckEditorItemSelector,
  ItemType,
} from "@/components/DeckEditor/DeckEditorItemSelector";
import { Cell, CellData } from "@workspace/deck/types/board";
import {
  FullscreenDialogDescription,
  FullscreenDialogHeader,
  FullscreenDialogTitle,
} from "@workspace/ui/components/fullscreen-dialog";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, useCallback, useMemo, useState } from "react";

const itemTypes: ItemType[] = [
  {
    title: "Streamer.bot Action",
    description: "Execute an action",
    type: "streamerbot.action",
  },
  {
    title: "Streamer.bot Switch",
    description: "Toggle between two states",
    type: "streamerbot.switch",
  },
];

export type DeckEditorItemDialogContentProps = {
  cell: Cell;
  onSave: (data: Cell) => void;
  onCancel: () => void;
};

export const DeckEditorItemDialogContent = memo(
  (props: DeckEditorItemDialogContentProps) => {
    useLogRenders("DeckEditorItemDialogContent");

    const { cell, onSave, onCancel } = props;

    const [selectedType, setSelectedType] = useState<CellData["type"]>();

    const handleSelectType = useCallback((type: CellData["type"]) => {
      setSelectedType(type);
    }, []);

    const handleSave = useCallback(
      (data: Cell) => {
        onSave(data);
      },
      [onSave],
    );

    const handleCancel = useCallback(() => {
      onCancel();
    }, [onCancel]);

    const title = useMemo(() => {
      if (!selectedType) {
        return "Select Item Type";
      } else {
        return itemTypes.find((type) => type.type == selectedType)?.title;
      }
    }, [selectedType]);

    const item: Cell = useMemo(() => {
      const selected = selectedType ? { type: selectedType } : undefined;
      const data = cell.data ? cell.data : selected;

      return {
        ...cell,
        data,
      };
    }, [cell, selectedType]);

    const content = !item.data ? (
      <DeckEditorItemSelector
        itemTypes={itemTypes}
        onSelect={handleSelectType}
      />
    ) : (
      <div className="flex justify-center items-center h-full">
        <div className="w-[500px]">
          <DeckEditorItemForm
            cell={item}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );

    return (
      <>
        <FullscreenDialogHeader className="h-[42px]">
          <FullscreenDialogTitle>{title}</FullscreenDialogTitle>
          <FullscreenDialogDescription></FullscreenDialogDescription>
        </FullscreenDialogHeader>
        <div className="h-[calc(100%-42px)] border-t-2 -mx-6 px-6">
          {content}
        </div>
      </>
    );
  },
);
