import { DeckPageButton } from "@/components/DeckPageButton";
import { InstanceIdContext } from "@/components/Instance";
import { useDeckMutation } from "@/mutations/deck";
import { useActionsQuery } from "@/queries/actions";
import { useDeckQuery } from "@/queries/deck";
import { useSettingsQuery } from "@/queries/settings";
import { DeckButtons } from "@/types/deck";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DeckFormData } from "@workspace/deck/components/NewDeck/DeckForm";
import { DeckGrid } from "@workspace/deck/components/NewDeck/DeckGrid";
import { useCallback, useEffect, useMemo, useState } from "react";

function getInstanceId() {
  return Symbol("instance-id");
}

type DeckProps = {
  pageNumber: number;
};

export function DeckPage(props: DeckProps) {
  const settingsQuery = useSettingsQuery();
  const actionsQuery = useActionsQuery();
  const deckQuery = useDeckQuery();

  const { mutate } = useDeckMutation();

  const handleSave = useCallback(
    (pageId: string, buttons: DeckButtons) => {
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
    },
    [deckQuery, mutate],
  );

  const actions = useMemo(() => {
    return (
      actionsQuery.data?.map((action) => ({
        value: action.id,
        label: action.name,
      })) ?? []
    );
  }, [actionsQuery.data]);

  const [instanceId] = useState(getInstanceId);

  const page = deckQuery.data?.pages[props.pageNumber];

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.instanceId === instanceId;
      },
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];

        if (!destination) {
          return;
        }

        const dropId = destination.data.id;
        const dragId = source.data.id;

        if (typeof dropId !== "number") {
          return;
        }

        if (typeof dragId !== "number") {
          return;
        }

        if (page) {
          const buffer = page.buttons[dropId];

          handleSave(page.id, {
            ...page.buttons,
            [dropId]: page.buttons[dragId],
            [dragId]: buffer,
          });
        }
      },
    });
  }, [instanceId, page, handleSave]);

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
    console.error(actionsQuery.error, deckQuery.error);
    return "Error...";
  }

  const handleFormSave = (id: string, data: DeckFormData) => {
    handleSave(page.id, {
      ...page.buttons,
      [id]: data,
    });
  };

  return (
    <InstanceIdContext.Provider value={instanceId}>
      <DeckGrid
        key={page.id}
        rows={settingsQuery.data.layout.rows}
        columns={settingsQuery.data.layout.columns}
        className="w-full h-full flex justify-center items-center"
      >
        {(id) => (
          <DeckPageButton
            key={id}
            id={id}
            width={100 / settingsQuery.data.layout.columns}
            height={100 / settingsQuery.data.layout.rows}
            button={page.buttons[id]}
            actions={actions}
            onSave={(id, data) => handleFormSave(id.toString(), data)}
          />
        )}
      </DeckGrid>
    </InstanceIdContext.Provider>
  );
}
