import { ComboboxProps } from "@workspace/ui/components/combobox";
import { Icon, icons } from "@workspace/ui/components/icon";
import { VirtualizedCombobox } from "@workspace/ui/components/virtualized-combobox";

const iconItems = icons.map((icon) => ({
  value: icon,
  label: icon,
  icon: <Icon name={icon} />,
}));

export type IconPickerProps = Omit<ComboboxProps, "items" | "placeholder">;

export function IconPicker(props: IconPickerProps) {
  return (
    <VirtualizedCombobox
      {...props}
      items={iconItems ?? []}
      placeholder="Icon"
    />
  );
}
