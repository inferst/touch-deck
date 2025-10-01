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
import { JSX, useRef } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

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

export function VirtualizedCombobox(props: ComboboxProps) {
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
        <CommandContent
          value={value}
          items={items}
          placeholder={placeholder}
          onChange={(value) => {
            onChange(value);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type CommandContentProps = {
  value?: string;
  items: ComboboxItem[];
  placeholder: string;
  onChange: (value: string) => void;
};

function CommandContent(props: CommandContentProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const { value, items, placeholder, onChange } = props;

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
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
      <CommandList
        ref={parentRef}
        style={{
          height: "300px",
          width: "100%",
          overflow: "auto",
        }}
      >
        <CommandEmpty>No results</CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <CommandItem
                key={items[virtualItem.index]!.value}
                value={items[virtualItem.index]!.value}
                keywords={[items[virtualItem.index]!.label]}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {items[virtualItem.index]!.icon}
                {items[virtualItem.index]!.label}
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    value === items[virtualItem.index]!.value
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
