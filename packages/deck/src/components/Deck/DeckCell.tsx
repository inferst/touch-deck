import { DeckCellButton } from "@workspace/deck/components/Deck/DeckCellButton";
import {
  DeckForm,
  DeckFormData,
} from "@workspace/deck/components/Deck/DeckForm";
import { ComboboxItem } from "@workspace/ui/components/Combobox/Combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useMemo, useState } from "react";
import { DeckButton, DeckMode } from "src/types/deck";

type DeckCellProps = {
  id: number;
  width: number;
  button?: DeckButton;
  mode: DeckMode;
  actions?: ComboboxItem[];
  onSave: (button: DeckButton) => void;
  onClick?: (id?: string) => void;
};

export function DeckCell(props: DeckCellProps) {
  const {
    id,
    width,
    button = {
      id,
      color: "#3c3c3c",
    },
    mode,
    actions,
    onClick,
    onSave,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (data: DeckFormData) => {
    onSave({
      ...button,
      ...data,
    });

    setIsOpen(false);
  };

  const isNotEmpty = useMemo(() => {
    return !!(button.startActionId || button.endActionId);
  }, [button]);

  return mode == "edit" ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DeckCellButton
          id={id}
          button={button}
          width={width}
          isNotEmpty={isNotEmpty}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Button Settings</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
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
      button={button}
      width={width}
      isNotEmpty={isNotEmpty}
      onClick={() => onClick?.(button.startActionId)}
    />
  );
}
