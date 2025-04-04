import { useDeckMutation } from "@/mutations/deck";
import { useActionsQuery } from "@/queries/actions";
import { useDeckQuery } from "@/queries/deck";
import { useSettingsQuery } from "@/queries/settings";
import { DeckButtons } from "@/types/deck";
import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";
import { useMemo } from "react";

export function Deck() {
  const settingsQuery = useSettingsQuery();
  const actionsQuery = useActionsQuery();
  const deckQuery = useDeckQuery();

  const { mutate } = useDeckMutation();

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

  const handleTouchDown = (id: number) => {};

  const handleTouchUp = (id: number) => {};

  const handleSave = (pageId: string, buttons: DeckButtons) => {
    mutate({
      ...deckQuery.data,
      pages: deckQuery.data.pages.map((page) => {
        if (pageId == page.id) {
          return {
            ...page,
            buttons,
          };
        }

        return page;
      }),
    });
  };

  const actions = useMemo(() => {
    return actionsQuery.data.map((action) => ({
      value: action.id,
      label: action.name,
    }));
  }, [actionsQuery.data]);

  return (
    <>
      {deckQuery.data.pages.map((page) => {
        return (
          <DeckGrid
            key={page.id}
            rows={settingsQuery.data.layout.rows}
            columns={settingsQuery.data.layout.columns}
            buttons={page.buttons}
            actions={actions}
            mode="edit"
            onSave={(buttons) => handleSave(page.id, buttons)}
            onTouchDown={handleTouchDown}
            onTouchUp={handleTouchUp}
            className="w-full h-full flex justify-center items-center"
          />
        );
      })}
    </>
  );
}
