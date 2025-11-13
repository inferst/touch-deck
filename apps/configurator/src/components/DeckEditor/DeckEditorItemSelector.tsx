import { CellData } from "@workspace/deck/types/board";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@workspace/ui/components/item";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ArrowRightIcon, Search } from "lucide-react";
import { memo, useMemo, useState } from "react";

export type ItemType = {
  title: string;
  description: string;
  type: CellData["type"];
};

export type DeckEditorItemSelectorProps = {
  itemTypes: ItemType[];
  onSelect: (type: CellData["type"]) => void;
};

export const DeckEditorItemSelector = memo(
  (props: DeckEditorItemSelectorProps) => {
    const { itemTypes, onSelect } = props;

    const [search, setSearch] = useState("");

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    };

    const filteredItems = useMemo(() => {
      return itemTypes.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      );
    }, [search, itemTypes]);

    return (
      <ScrollArea className="h-full pr-6 mt-6 pb-6">
        <div className="flex justify-center items-center h-full">
          <div className="grow relative">
            <div className="fixed left-0 pl-6 pr-12 w-full h-12 bg-background">
              <InputGroup>
                <InputGroupInput
                  placeholder="Search..."
                  onInput={handleInput}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="mt-12">
              <div className="mt-4 mb-2">Streamer.bot</div>
              <ItemGroup className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-2">
                {filteredItems.map((item) => (
                  <Item
                    onClick={() => onSelect(item.type)}
                    key={item.type}
                    variant="outline"
                    asChild
                    role="listitem"
                    className="bg-card [a]:hover:bg-card"
                  >
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onSelect(item.type)}
                    >
                      <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <ArrowRightIcon className="size-4" />
                      </ItemActions>
                    </a>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  },
);
