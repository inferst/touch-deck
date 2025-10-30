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
import { useState } from "react";

type DeckPageButtonProps = {
  id: number;
  width: number;
  height: number;
  button?: DeckButton;
  actions?: ComboboxItem[];
  onSave: (id: number, button: DeckButton) => void;
  onDeckCellDrop?: (id: string) => void;
};

export function DeckPageButton(props: DeckPageButtonProps) {
  const {
    id,
    width,
    height,
    button = {},
    actions,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>
        <DeckCellButton
          id={id}
          text={button.title}
          icon={button.icon}
          backgroundColor={button.color}
          width={width}
          height={height}
          onDrop={onDeckCellDrop}
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
