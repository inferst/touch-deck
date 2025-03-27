import { useDeckMutation } from "@/mutations/deck";
import { useDeckQuery } from "@/queries/deck";
import { useSettingsQuery } from "@/queries/settings";
import { DeckButtons } from "@/types/deck";
import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";
import { DeckButton } from "@workspace/deck/types/deck";

export function Deck() {
  const { data: settingsData, isError, isPending } = useSettingsQuery();
  const { mutate } = useDeckMutation();

  const {
    data: deckData,
    isError: isDeckError,
    isPending: isDeckPending,
  } = useDeckQuery();

  if (isPending || isDeckPending) {
    return "Loading...";
  }

  if (isError || isDeckError) {
    return "Error...";
  }

  const handleTouchDown = (id: number) => {};

  const handleTouchUp = (id: number) => {};

  const handleSave = (pageId: string, buttons: DeckButtons) => {
    mutate({
      ...deckData,
      pages: deckData.pages.map((page) => {
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

  return (
    <>
      {deckData.pages.map((page) => {
        return (
          <DeckGrid
            key={page.id}
            rows={settingsData.layout.rows}
            columns={settingsData.layout.columns}
            buttons={page.buttons}
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
