import {
  useCreateBoardMutation,
  useDeleteBoardMutation,
} from "@/mutations/board";
import { usePagesQuery } from "@/queries/page";
import { confirm } from "@tauri-apps/plugin-dialog";
import { PageDto } from "@workspace/deck/dto/PageDto";
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
  selectedBoardId: number;
  onSelectedBoardChange: (id: number) => void;
};

export const Pages = memo((props: PagesProps) => {
  useLogRenders("Pages");

  const { selectedBoardId, onSelectedBoardChange } = props;

  const pagesQuery = usePagesQuery(1);

  const createBoardMutation = useCreateBoardMutation();
  const deleteBoardMutation = useDeleteBoardMutation();

  if (pagesQuery.isPending || pagesQuery.isError) {
    return "Loading";
  }

  const handleAdd = () => {
    createBoardMutation.mutate({
      board: {
        board: {
          profileId: 1,
        },
      },
      createPage: true,
    });
  };

  const handlePageClick = (id: number) => {
    onSelectedBoardChange(id);
  };

  const handleDelete = async () => {
    const answer = await confirm(
      "This action cannot be reverted. Are you sure?",
      {
        title: `Delete page`,
        kind: "warning",
      },
    );

    if (answer) {
      let prevPage: PageDto | undefined;

      for (let index = pagesQuery.data.length - 1; index >= 0; index--) {
        if (pagesQuery.data[index]?.page.boardId == selectedBoardId) {
          prevPage = pagesQuery.data[index - 1];
        }
      }

      deleteBoardMutation.mutate(selectedBoardId);

      if (prevPage) {
        onSelectedBoardChange(prevPage.page.boardId);
      }
    }
  };

  const pages = pagesQuery.data.map((page) => {
    return (
      <Button
        key={page.page.boardId}
        onClick={() => handlePageClick(page.page.boardId)}
        variant={selectedBoardId == page.page.boardId ? "secondary" : "outline"}
        className={cn({
          "border dark:border-input": selectedBoardId == page.page.boardId,
        })}
      >
        {page.page.position + 1}
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
          disabled={pagesQuery.data.length >= 9}
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
              disabled={selectedBoardId == 0}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
