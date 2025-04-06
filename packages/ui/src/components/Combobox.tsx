import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { JSX } from "react";

export type ComboboxItem = {
  value: string;
  label: string;
  icon?: JSX.Element;
};

type ComboboxProps = {
  value?: string;
  items: ComboboxItem[];
  placeholder: string;
  onChange: (value: string) => void;
};

export function Combobox(props: ComboboxProps) {
  const { value, items, placeholder, onChange } = props;

  const [open, setOpen] = React.useState(false);

  const current = items.find((item) => item.value == value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {value ? (
            <span className="flex items-center truncate">
              {current?.icon && <span className="mr-2">{current?.icon}</span>}{" "}
              {current?.label}
            </span>
          ) : (
            <span className="text-secondary">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command
          filter={(_, search, keywords) => {
            const value = keywords?.map((word) => word.toLowerCase()).join(" ");

            if (value?.includes(search.toLowerCase())) {
              return 1;
            }

            return 0;
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  keywords={[item.label]}
                  onSelect={(currentValue) => {
                    if (currentValue != value) {
                      onChange(currentValue);
                    }

                    setOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
