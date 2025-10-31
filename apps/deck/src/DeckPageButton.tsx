import { DeckCellButton } from "@workspace/deck/components/NewDeck/DeckCellButton";
import { DeckButton } from "@workspace/deck/types/deck";

type DeckPageButtonProps = {
  id: number;
  width: number;
  height: number;
  button?: DeckButton;
  onPointerDown?: (id: string) => void;
  onPointerUp?: (id: string) => void;
};

export function DeckPageButton(props: DeckPageButtonProps) {
  const { id, width, height, button = {}, onPointerDown, onPointerUp } = props;

  const handlePointerUp = () => {
    if (button.endActionId) {
      onPointerUp?.(button.endActionId);
    }
  };

  const handlePointerDown = () => {
    if (button.startActionId) {
      onPointerDown?.(button.startActionId);
    }
  };

  return (
    <DeckCellButton
      id={id}
      text={button.title}
      icon={button.icon}
      backgroundColor={button.color}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
}
