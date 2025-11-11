import { StreamerbotActionForm } from "@/components/DeckEditor/ItemForm/StreamerbotActionForm";
import { StreamerbotSwitchForm } from "@/components/DeckEditor/ItemForm/StreamerbotSwitchForm";
import { Cell, CellData } from "@workspace/deck/types/board";
import { UseFormReturn } from "react-hook-form";

const formMap = {
  "streamerbot.action": StreamerbotActionForm,
  "streamerbot.switch": StreamerbotSwitchForm,
} satisfies Record<
  CellData["type"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.FC<any>
>;

export type ItemFormProps = {
  data: CellData;
  form: UseFormReturn<Cell>;
};

export function ItemForm(props: ItemFormProps) {
  const Component = formMap[props.data.type] as React.FC<typeof props>;
  return <Component {...props} />;
}
