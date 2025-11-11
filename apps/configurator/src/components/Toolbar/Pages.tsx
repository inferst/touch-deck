import { useDeckMutation } from "@/mutations/deck";
import { useDeckQuery } from "@/queries/deck";
import { confirm } from "@tauri-apps/plugin-dialog";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import { memo } from "react";

type PagesProps = {
  selectedPageNumber: number;
  onPageChange: (pageNumber: number) => void;
};

export const Pages = memo((props: PagesProps) => {
  useLogRenders('Pages');

  const deckQuery = useDeckQuery();
  const deckMutation = useDeckMutation();

  if (deckQuery.isPending || deckQuery.isError) {
    return "Loading";
  }

  const handleAdd = () => {
    deckMutation.mutate({
      ...deckQuery.data,
      pages: [
        ...deckQuery.data.pages,
        {
          id: crypto.randomUUID(),
          board: {},
        },
      ],
    });
  };

  const handlePageClick = (page: number) => {
    props.onPageChange(page);
  };

  const handleDelete = async () => {
    const id = deckQuery.data?.pages[props.selectedPageNumber]?.id;

    if (id) {
      const answer = await confirm(
        "This action cannot be reverted. Are you sure?",
        {
          title: `Delete page`,
          kind: "warning",
        },
      );

      if (answer) {
        deckMutation.mutate({
          ...deckQuery.data,
          pages: deckQuery.data.pages.filter((page) => page.id != id),
        });

        props.onPageChange(props.selectedPageNumber - 1);
      }
    }
  };

  const pages = deckQuery.data.pages.map((page, index) => {
    return (
      <Button
        key={page.id}
        onClick={() => handlePageClick(index)}
        variant={props.selectedPageNumber == index ? "secondary" : "outline"}
        className={cn({
          "border dark:border-input": props.selectedPageNumber == index,
        })}
      >
        {index + 1}
      </Button>
    );
  });

  return (
    <div className="flex mt-2">
      <ButtonGroup>
        {...pages}
        <Button
          onClick={handleAdd}
          variant={"outline"}
          size={"icon"}
          disabled={deckQuery.data.pages.length >= 9}
        >
          <PlusIcon />
        </Button>
      </ButtonGroup>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"} className="ml-2">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Page Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={props.selectedPageNumber == 0}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
