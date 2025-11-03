import { DeckEditorItemForm } from "@/components/DeckEditor/DeckEditorItemForm";
import { Cell, CellData } from "@workspace/deck/types/board";
import { Button } from "@workspace/ui/components/button";
import { memo, useCallback, useMemo, useState } from "react";

type DeckEditorItemTypeProps = {
  cell: Cell;
  onSave: (data: Cell) => void;
  onCancel: () => void;
};

export const DeckEditorItemType = memo((props: DeckEditorItemTypeProps) => {
  const { cell, onSave } = props;
  const [selectedType, setSelectedType] = useState<CellData["type"]>();

  const handleSelectType = (type: CellData["type"]) => {
    setSelectedType(type);
  };

  const handleSave = useCallback(
    (data: Cell) => {
      onSave(data);
    },
    [onSave],
  );

  const item: Cell = useMemo(() => {
    const selected = selectedType ? { type: selectedType } : undefined;
    const data = cell.data ? cell.data : selected;

    return {
      ...cell,
      data,
    };
  }, [cell, selectedType]);

  return (
    <>
      {!item.data && (
        <div>
          <Button onClick={() => handleSelectType("streamerbot.action")}>
            Streamerbot Action
          </Button>
          <Button onClick={() => handleSelectType("streamerbot.switch")}>
            Streamerbot Switch
          </Button>
        </div>
      )}
      {item.data && (
        <div className="flex justify-center items-center h-full">
          <div className="w-[500px]">
            <DeckEditorItemForm
              cell={item}
              onSave={handleSave}
              onCancel={() => {}}
            />
          </div>
        </div>
      )}
    </>
  );
});
