import { DeckEditorItem } from "@/components/DeckEditor/DeckEditorItem";
import { InstanceIdContext } from "@/components/Instance";
import { useSetActionMutation, useSwapItemsMutation } from "@/mutations/action";
import { useBoardQuery } from "@/queries/board";
import { useLayoutQuery, useStyleQuery } from "@/queries/profile";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DeckGrid } from "@workspace/deck/components/DeckGrid";
import { BoardDto } from "@workspace/deck/dto/BoardDto";
import { Cell, Spacing } from "@workspace/deck/types/board";
import { TitleSchema } from "@workspace/deck/types/field";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

function getInstanceId() {
  return Symbol("instance-id");
}

type DeckProps = {
  boardId: number;
};

function getCell(board: BoardDto, row: number, col: number): Cell | undefined {
  const action = board.actions.find(
    (action) => action.item.row == row && action.item.col == col,
  );

  if (action) {
    return {
      id: action.item.id,
      boardId: action.item.boardId,
      col: action.item.col,
      row: action.item.row,
      background: {
        color: action.color?.value ?? undefined,
      },
      type: action.item.kind,
      icon: {
        icon: action.icon?.name ?? undefined,
        color: action.icon?.color ?? undefined,
      },
      title: {
        title: action.title?.value ?? undefined,
        color: action.title?.color ?? undefined,
        align: TitleSchema.shape.align.parse(action.title?.align ?? "bottom"),
        font: action.title?.font ?? undefined,
      },
    };
  } else {
    return {
      boardId: board.board.id,
      col: col,
      row: row,
      background: {},
      type: "",
      icon: { icon: "" },
      title: { title: "" },
    };
  }
}

export const DeckEditor = memo((props: DeckProps) => {
  useLogRenders("DeckEditor");

  const { boardId } = props;

  const board = useBoardQuery(boardId);
  const layout = useLayoutQuery(1);
  const style = useStyleQuery(1);

  console.log("board", board.data.actions);

  const actionMutate = useSetActionMutation();
  const swapItemsMutate = useSwapItemsMutation();

  const [instanceId] = useState(getInstanceId);

  const rows = layout.data.layout.rows ?? 3;
  const cols = layout.data.layout.cols ?? 5;

  const spacing = style.data.style.spacing ?? 2;

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

        const dropRow = destination.data.row;
        const dropCol = destination.data.col;

        const dragRow = source.data.row;
        const dragCol = source.data.col;

        console.log(dropRow, dropCol, dragRow, dragCol);

        if (
          typeof dropRow !== "number" ||
          typeof dropCol !== "number" ||
          typeof dragRow !== "number" ||
          typeof dragCol !== "number"
        ) {
          return;
        }

        swapItemsMutate.mutate({
          row1: dragRow,
          col1: dragCol,
          row2: dropRow,
          col2: dropCol,
        });
      },
    });
  }, [instanceId, swapItemsMutate]);

  const handleFormSave = useCallback(
    (data: Cell) => {
      actionMutate.mutate({
        item: {
          id: data.id ?? null,
          boardId: data.boardId,
          row: data.row,
          col: data.col,
          kind: data.type,
        },
        title: {
          itemId: null,
          value: data.title?.title ?? null,
          align: data.title?.align ?? null,
          color: data.title?.color ?? null,
          font: data.title?.font ?? null,
          size: data.title?.size ?? null,
        },
        icon: {
          itemId: null,
          name: data.icon?.icon ?? null,
          color: data.icon?.color ?? null,
        },
        image: null,
        color: {
          itemId: null,
          value: data.background?.color ?? null,
        },
      });
    },
    [actionMutate],
  );

  const maxWidth = useMemo(() => cols * 160, [cols]);
  const maxHeight = useMemo(() => rows * 160, [rows]);

  return (
    <InstanceIdContext.Provider value={instanceId}>
      <DeckGrid
        key={boardId}
        rows={rows}
        columns={cols}
        spacing={spacing as Spacing}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        className="w-full h-full flex justify-center items-center"
      >
        {(row, col) => {
          const cell = getCell(board.data, row, col);
          return cell && <DeckEditorItem cell={cell} onSave={handleFormSave} />;
        }}
      </DeckGrid>
    </InstanceIdContext.Provider>
  );
});
