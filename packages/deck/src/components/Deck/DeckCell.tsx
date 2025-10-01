import { DeckCellButton } from "@workspace/deck/components/Deck/DeckCellButton";
import {
  DeckForm,
  DeckFormData,
} from "@workspace/deck/components/Deck/DeckForm";
import { DeckButton, DeckMode } from "@workspace/deck/types/deck";
import { ComboboxItem } from "@workspace/ui/components/Combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useState } from "react";

type DeckCellProps = {
  id: number;
  width: number;
  button?: DeckButton;
  mode: DeckMode;
  actions?: ComboboxItem[];
  onSave: (id: number, button: DeckButton) => void;
  onActionStart?: (id: string) => void;
  onActionEnd?: (id: string) => void;
  onDeckCellDrop?: (id: string) => void;
};

export function DeckCell(props: DeckCellProps) {
  const {
    id,
    width,
    button = {
      color: "#3c3c3c",
    },
    mode,
    actions,
    onActionStart,
    onActionEnd,
    onDeckCellDrop,
    onSave,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (data: DeckFormData) => {
    onSave(id, {
      ...button,
      ...data,
    });

    setIsOpen(false);
  };

  return mode == "edit" ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>
        <DeckCellButton
          id={id}
          button={button}
          width={width}
          isDnDEnabled={true}
          onDrop={onDeckCellDrop}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Button Settings</DialogTitle>
        </DialogHeader>
        <DeckForm
          data={button}
          actions={actions}
          onSave={handleSave}
          onCancel={() => {}}
        />
      </DialogContent>
    </Dialog>
  ) : (
    <DeckCellButton
      id={id}
      isActionEnabled={true}
      button={button}
      width={width}
      onStart={onActionStart}
      onEnd={onActionEnd}
    />
  );
}
