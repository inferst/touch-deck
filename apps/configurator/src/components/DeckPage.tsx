import { DeckPageCell } from "@/components/DeckPageCell";
import { InstanceIdContext } from "@/components/Instance";
import { useDeckMutation } from "@/mutations/deck";
import { useActionsQuery } from "@/queries/actions";
import { useDeckQuery } from "@/queries/deck";
import { useSettingsQuery } from "@/queries/settings";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  findCellById,
  generateBoard,
  getCell,
  setCell,
  setCellById,
} from "@workspace/deck/board";
import { DeckFormData } from "@workspace/deck/components/DeckForm";
import { DeckGrid } from "@workspace/deck/components/DeckGrid";
import { Board } from "@workspace/deck/types";
import { useCallback, useEffect, useMemo, useState } from "react";

function getInstanceId() {
  return Symbol("instance-id");
}

type DeckProps = {
  pageNumber: number;
};

export function DeckPage(props: DeckProps) {
  const settingsQuery = useSettingsQuery();
  const actionsQuery = useActionsQuery();
  const deckQuery = useDeckQuery();

  const { mutate } = useDeckMutation();

  const handleSave = useCallback(
    (pageId: string, board: Board) => {
      mutate({
        ...deckQuery.data,
        pages:
          deckQuery.data?.pages.map((page) => {
            if (pageId == page.id) {
              return {
                ...page,
                board: board,
              };
            }

            return page;
          }) ?? [],
      });
    },
    [deckQuery, mutate],
  );

  const actions = useMemo(() => {
    return (
      actionsQuery.data?.map((action) => ({
        value: action.id,
        label: action.name,
      })) ?? []
    );
  }, [actionsQuery.data]);

  const [instanceId] = useState(getInstanceId);

  const page = deckQuery.data?.pages[props.pageNumber];

  const rows = settingsQuery.data?.layout?.rows ?? 3;
  const cols = settingsQuery.data?.layout?.columns ?? 5;

  const pageBoard = useMemo(
    () => generateBoard(rows, cols, page?.board ?? {}),
    [rows, cols, page],
  );

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

        if (page) {
          const dropCell = findCellById(pageBoard, dropId);
          const dragCell = findCellById(pageBoard, dragId);

          if (dropCell && dragCell) {
            const withDrag = setCell(
              pageBoard,
              dropCell.row,
              dropCell.col,
              dragCell.cell,
            );

            const board = setCell(
              withDrag,
              dragCell.row,
              dragCell.col,
              dropCell.cell,
            );

            handleSave(page.id, board);
          }
        }
      },
    });
  }, [instanceId, page, pageBoard, handleSave]);

  const handleFormSave = useCallback(
    (data: DeckFormData) => {
      const board = setCellById(pageBoard, data);
      if (page) {
        handleSave(page.id, board);
      }
    },
    [page, pageBoard, handleSave],
  );

  if (!page) {
    return "Not found";
  }

  if (
    settingsQuery.isPending ||
    deckQuery.isPending ||
    actionsQuery.isPending
  ) {
    return "Loading...";
  }

  if (settingsQuery.isError || deckQuery.isError || actionsQuery.isError) {
    console.error(actionsQuery.error, deckQuery.error);
    return "Error...";
  }

  return (
    <InstanceIdContext.Provider value={instanceId}>
      <DeckGrid
        key={page.id}
        rows={settingsQuery.data.layout.rows}
        columns={settingsQuery.data.layout.columns}
        className="w-full h-full flex justify-center items-center"
      >
        {(row, col) => {
          const cell = getCell(pageBoard, row, col);
          return (
            cell && (
              <DeckPageCell
                key={cell.id}
                width={100 / settingsQuery.data.layout.columns}
                height={100 / settingsQuery.data.layout.rows}
                cell={cell}
                actions={actions}
                onSave={handleFormSave}
              />
            )
          );
        }}
      </DeckGrid>
    </InstanceIdContext.Provider>
  );
}
