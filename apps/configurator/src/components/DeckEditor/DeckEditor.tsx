import { DeckEditorItem } from "@/components/DeckEditor/DeckEditorItem";
import { InstanceIdContext } from "@/components/Instance";
import { useDeckContext } from "@/context/DeckContext";
import { useSettingsContext } from "@/context/SettingsContext";
import { useDeckMutation } from "@/mutations/deck";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  findCellById,
  generateBoard,
  getCell,
  setCell,
  setCellById,
} from "@workspace/deck/board";
import { DeckGrid } from "@workspace/deck/components/DeckGrid";
import { Board, Cell } from "@workspace/deck/types/board";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

function getInstanceId() {
  return Symbol("instance-id");
}

type DeckProps = {
  page: number;
};

export const DeckEditor = memo((props: DeckProps) => {
  const { page } = props;

  const settings = useSettingsContext();
  const deck = useDeckContext();

  const { mutate } = useDeckMutation();

  const handleSave = useCallback(
    (pageId: string, board: Board) => {
      mutate({
        ...deck,
        pages: deck.pages.map((page) => {
          if (pageId == page.id) {
            return {
              ...page,
              board: board,
            };
          }

          return page;
        }),
      });
    },
    [deck, mutate],
  );

  const [instanceId] = useState(getInstanceId);

  const rows = settings.layout.rows;
  const cols = settings.layout.columns;

  const board = useMemo(() => {
    const board = deck.pages[page]?.board ?? {};
    return generateBoard(rows, cols, board);
  }, [rows, cols, deck.pages, page]);

  const pageId = useMemo(() => {
    return deck.pages[page]?.id;
  }, [deck.pages, page]);

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.instanceId === instanceId;
      },
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];

        if (!destination) {
          return;
        }

        const dropId = destination.data.id;
        const dragId = source.data.id;

        if (typeof dropId !== "string") {
          return;
        }

        if (typeof dragId !== "string") {
          return;
        }

        if (pageId) {
          const dropCell = findCellById(board, dropId);
          const dragCell = findCellById(board, dragId);

          if (dropCell && dragCell) {
            const withDrag = setCell(
              board,
              dropCell.row,
              dropCell.col,
              dragCell.cell,
            );

            const withDrop = setCell(
              withDrag,
              dragCell.row,
              dragCell.col,
              dropCell.cell,
            );

            handleSave(pageId, withDrop);
          }
        }
      },
    });
  }, [instanceId, pageId, board, handleSave]);

  const handleFormSave = useCallback(
    (data: Cell) => {
      const updated = setCellById(board, data);
      if (pageId) {
        handleSave(pageId, updated);
      }
    },
    [pageId, board, handleSave],
  );

  if (!pageId) {
    return "Page not found";
  }

  console.log("DeckEditor render");

  return (
    <InstanceIdContext.Provider value={instanceId}>
      <DeckGrid
        key={pageId}
        rows={settings.layout.rows}
        columns={settings.layout.columns}
        spacing={settings.style.spacing}
        className="w-full h-full flex justify-center items-center"
      >
        {(row, col) => {
          const cell = getCell(board, row, col);
          return cell && <DeckEditorItem cell={cell} onSave={handleFormSave} />;
        }}
      </DeckGrid>
    </InstanceIdContext.Provider>
  );
});
