import { useDeckMutation } from "@/mutations/deck";
import { useActionsQuery } from "@/queries/actions";
import { useDeckQuery } from "@/queries/deck";
import { useSettingsQuery } from "@/queries/settings";
import { DeckButtons } from "@/types/deck";
import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";
import { useMemo } from "react";

type DeckProps = {
  pageNumber: number;
};

export function DeckPage(props: DeckProps) {
  const settingsQuery = useSettingsQuery();
  const actionsQuery = useActionsQuery();
  const deckQuery = useDeckQuery();

  const { mutate } = useDeckMutation();

  const handleSave = (pageId: string, buttons: DeckButtons) => {
    mutate({
      ...deckQuery.data,
      pages:
        deckQuery.data?.pages.map((page) => {
          if (pageId == page.id) {
            return {
              ...page,
              buttons,
            };
          }

          return page;
        }) ?? [],
    });
  };

  const actions = useMemo(() => {
    return (
      actionsQuery.data?.map((action) => ({
        value: action.id,
        label: action.name,
      })) ?? []
    );
  }, [actionsQuery.data]);

  const page = deckQuery.data?.pages[props.pageNumber];

  if (!page) {
    return "Not found";
  }

  if (
    settingsQuery.isPending ||
    deckQuery.isPending ||
    actionsQuery.isPending
  ) {
    return "Loading...";
  }

  if (settingsQuery.isError || deckQuery.isError || actionsQuery.isError) {
    return "Error...";
  }

  return (
    <DeckGrid
      key={page.id}
      rows={settingsQuery.data.layout.rows}
      columns={settingsQuery.data.layout.columns}
      buttons={page.buttons}
      actions={actions}
      mode="edit"
      onSave={(buttons) => handleSave(page.id, buttons)}
      className="w-full h-full flex justify-center items-center"
    />
  );
}
