import { DeckEditorItemDialogContent } from "@/components/DeckEditor/DeckEditorItemDialogContent";
import { InstanceIdContext } from "@/components/Instance";
import { useStyleQuery } from "@/queries/profile";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DeckGridCell } from "@workspace/deck/components/DeckGridCell";
import { BorderRadius, Cell } from "@workspace/deck/types/board";
import {
  FullscreenDialog,
  FullscreenDialogContent,
  FullscreenDialogTrigger,
} from "@workspace/ui/components/fullscreen-dialog";
import { useLogRenders } from "@workspace/utils/debug";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type DeckEditorItemProps = {
  cell: Cell;
  onSave: (cell: Cell) => void;
};

export const DeckEditorItem = memo((props: DeckEditorItemProps) => {
  useLogRenders("DeckEditorItem");

  const { cell, onSave } = props;

  const style = useStyleQuery(1);

  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleSave = useCallback(
    (data: Cell) => {
      onSave({
        ...cell,
        ...data,
      });

      setIsOpen(false);
    },
    [onSave, cell],
  );

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const instanceId = useContext(InstanceIdContext);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      throw Error("No element");
    }

    return combine(
      draggable({
        element: element,
        getInitialData: () => ({
          type: "cell",
          id: cell.id,
          row: cell.row,
          col: cell.col,
          instanceId,
        }),
      }),
      dropTargetForElements({
        element: element,
        getData: () => ({ id: cell.id, row: cell.row, col: cell.col }),
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
  }, [instanceId, cell.id, cell.row, cell.col]);

  const borderColor = useMemo(
    () => (isDragOver ? "#ccc" : undefined),
    [isDragOver],
  );

  const [isHovered, setIsHovered] = useState(false);

  const isEmpty = useMemo(() => !cell?.type, [cell]);

  const icon = useMemo(
    () => (isEmpty && isHovered ? "plus" : cell?.icon?.icon),
    [cell, isHovered, isEmpty],
  );

  const iconSize = useMemo(
    () => (isEmpty && isHovered ? 2 : undefined),
    [isHovered, isEmpty],
  );

  const backgroundColor = useMemo(
    () => (isEmpty && isHovered ? "#555555" : cell?.background?.color),
    [cell, isHovered, isEmpty],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const borderRadius = style.data.style.borderRadius as BorderRadius;

  return (
    <FullscreenDialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <FullscreenDialogTrigger asChild>
        <DeckGridCell
          ref={ref}
          text={cell?.title?.title}
          icon={icon}
          iconSize={iconSize}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          borderRadius={borderRadius}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </FullscreenDialogTrigger>
      <FullscreenDialogContent>
        <DeckEditorItemDialogContent
          cell={cell}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </FullscreenDialogContent>
    </FullscreenDialog>
  );
});
