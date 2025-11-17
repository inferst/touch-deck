import { DeckEditorItemForm } from "@/components/DeckEditor/DeckEditorItemForm";
import {
  DeckEditorItemSelector,
  ItemGroup,
} from "@/components/DeckEditor/DeckEditorItemSelector";
import { usePluginsQuery } from "@/queries/plugins";
import { Cell } from "@workspace/deck/types/board";
import { Action, Plugins } from "@workspace/deck/types/plugin";
import {
  FullscreenDialogDescription,
  FullscreenDialogHeader,
  FullscreenDialogTitle,
} from "@workspace/ui/components/fullscreen-dialog";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, useCallback, useMemo, useState } from "react";

// const itemTypes: ItemType[] = [
//   {
//     title: "Streamer.bot Action",
//     description: "Execute an action",
//     type: "streamerbot.action",
//   },
//   {
//     title: "Streamer.bot Switch",
//     description: "Toggle between two states",
//     type: "streamerbot.switch",
//   },
// ];

export type DeckEditorItemDialogContentProps = {
  cell: Cell;
  onSave: (data: Cell) => void;
  onCancel: () => void;
};

function getActionByUuid(
  plugins: Plugins,
  uuid: string,
): { action: Action; pluginUuid: string } | undefined {
  for (const plugin of plugins.plugins) {
    const found = plugin.actions.find((type) => type.uuid == uuid);

    if (found) {
      return { action: found, pluginUuid: plugin.uuid };
    }
  }
}

function getItemGroups(plugins: Plugins): ItemGroup[] {
  return plugins.plugins.map((plugin) => {
    return {
      title: plugin.name,
      itemTypes: plugin.actions.map((action) => ({
        title: action.name,
        description: "",
        type: action.uuid,
      })),
    };
  });
}

export const DeckEditorItemDialogContent = memo(
  (props: DeckEditorItemDialogContentProps) => {
    useLogRenders("DeckEditorItemDialogContent");

    const { cell, onSave, onCancel } = props;

    const [selectedType, setSelectedType] = useState<string>();

    const pluginQuery = usePluginsQuery();

    const handleSelectType = useCallback((type: string) => {
      setSelectedType(type);
    }, []);

    const handleSave = useCallback(
      (data: Cell) => {
        onSave(data);
      },
      [onSave],
    );

    const handleCancel = useCallback(() => {
      onCancel();
    }, [onCancel]);

    const itemType = cell.type || selectedType;

    console.log('itemType', itemType);

    const action = useMemo(() => {
      return pluginQuery.data && itemType
        ? getActionByUuid(pluginQuery.data, itemType)
        : undefined;
    }, [itemType, pluginQuery.data]);

    const title = useMemo(() => {
      if (!selectedType) {
        return "Select Item Type";
      } else if (action) {
        return action.action.name;
      }
    }, [selectedType, action]);

    const item: Cell = useMemo(() => {
      return {
        ...cell,
        type: itemType,
      };
    }, [cell, itemType]);

    const itemGroups = useMemo(
      () => (pluginQuery.data ? getItemGroups(pluginQuery.data) : []),
      [pluginQuery.data],
    );

    const content =
      !cell.type && !selectedType ? (
        <DeckEditorItemSelector
          itemGroups={itemGroups}
          onSelect={handleSelectType}
        />
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className="w-[500px]">
            <DeckEditorItemForm
              cell={item}
              pluginUuid={action?.pluginUuid}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      );

    return (
      <>
        <FullscreenDialogHeader className="h-[42px]">
          <FullscreenDialogTitle>{title}</FullscreenDialogTitle>
          <FullscreenDialogDescription></FullscreenDialogDescription>
        </FullscreenDialogHeader>
        <div className="h-[calc(100%-42px)] border-t-2 -mx-6 px-6">
          {content}
        </div>
      </>
    );
  },
);
