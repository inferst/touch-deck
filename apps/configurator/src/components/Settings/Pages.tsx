import { useDeckMutation } from "@/mutations/deck";
import { useDeckQuery } from "@/queries/deck";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

type PagesProps = {
  selectedPageNumber: number;
  onPageChange: (pageNumber: number) => void;
};

function Pages(props: PagesProps) {
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
          buttons: {},
        },
      ],
    });
  };

  const handlePageClick = (page: number) => {
    props.onPageChange(page);
  };

  const handleDelete = () => {
    const id = deckQuery.data.pages[props.selectedPageNumber].id;

    if (id) {
      deckMutation.mutate({
        ...deckQuery.data,
        pages: deckQuery.data.pages.filter((page) => page.id != id),
      });

      props.onPageChange(props.selectedPageNumber - 1);
    }
  };

  return (
    <>
      {deckQuery.data.pages.map((page, index) => {
        return (
          <Button
            key={page.id}
            onClick={() => handlePageClick(index)}
            variant={
              props.selectedPageNumber == index ? "default" : "secondary"
            }
            className="m-2"
          >
            {index + 1}
          </Button>
        );
      })}
      <Button
        onClick={handleAdd}
        disabled={deckQuery.data.pages.length >= 4}
        className={cn("m-2")}
      >
        Add
      </Button>
      <Button
        onClick={handleDelete}
        disabled={props.selectedPageNumber == 0}
        className={cn("m-2")}
        variant={"destructive"}
      >
        Delete Page
      </Button>
    </>
  );
}

export { Pages };
