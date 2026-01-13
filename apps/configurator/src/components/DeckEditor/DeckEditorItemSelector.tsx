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
import { Fragment, memo, useMemo, useState } from "react";

export type ItemGroup = {
  title: string;
  itemTypes: ItemType[];
};

export type ItemType = {
  title: string;
  description: string;
  type: string;
};

export type DeckEditorItemSelectorProps = {
  itemGroups: ItemGroup[];
  onSelect: (type: string) => void;
};

export const DeckEditorItemSelector = memo(
  (props: DeckEditorItemSelectorProps) => {
    const { itemGroups, onSelect } = props;

    const [search, setSearch] = useState("");

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    };

    const filteredGroups = useMemo(() => {
      return itemGroups.filter((group) => {
        return (
          group.itemTypes.filter((item) => {
            return item.title.toLowerCase().includes(search.toLowerCase());
          }) || group.title.toLowerCase().includes(search.toLowerCase())
        );
      });
    }, [search, itemGroups]);

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
              {filteredGroups.map((group) => (
                <Fragment key={group.title}>
                  <div className="mt-4 mb-2">{group.title}</div>
                  <ItemGroup className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-2">
                    {group.itemTypes.map((item) => (
                      <Item
                        onClick={() => onSelect(item.type)}
                        key={item.type}
                        variant="outline"
                        asChild
                        role="listitem"
                        className="bg-card [a]:hover:bg-card"
                      >
                        <a target="_blank" rel="noopener noreferrer">
                          <ItemContent>
                            <ItemTitle>{item.title}</ItemTitle>
                            <ItemDescription>
                              {item.description}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <ArrowRightIcon className="size-4" />
                          </ItemActions>
                        </a>
                      </Item>
                    ))}
                  </ItemGroup>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  },
);
