import { ComboboxProps } from "@workspace/ui/components/Combobox";
import { Icon, icons } from "@workspace/ui/components/icon";
import { VirtualizedCombobox } from "@workspace/ui/components/VirtualizedCombobox";

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
