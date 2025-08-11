import { ConnectionStatus } from "@/components/Settings/ConnectionStatus";
import { Pages } from "@/components/Settings/Pages";
import {
  SettingsForm,
  SettingsFormData,
} from "@/components/Settings/SettingsForm";
import { useSettingsMutation } from "@/mutations/settings";
import { useDeckQuery } from "@/queries/deck";
import { useSettingsQuery } from "@/queries/settings";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useDeckMutation } from "@/mutations/deck";

type SettingsProps = {
  selectedPageNumber: number;
  onPageChange: (pageNumber: number) => void;
};

export function Settings(props: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const settingsQuery = useSettingsQuery();
  const deckQuery = useDeckQuery();

  const settingsMutation = useSettingsMutation();
  const deckMutation = useDeckMutation();

  const handleSave = (formData: SettingsFormData) => {
    const current = settingsQuery.data ?? {
      streamerbot: {},
      layout: {},
    };

    settingsMutation.mutate({
      ...current,
      streamerbot: {
        ...current.streamerbot,
        host: formData.host,
        port: formData.port == "" ? undefined : Number(formData.port),
        endpoint: formData.endpoint,
      },
      layout: {
        ...current.layout,
        rows: formData.rows,
        columns: formData.columns,
      },
    });

    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
  };

  const handleImport = async () => {
    const path = await open({
      filters: [
        {
          name: "Json Filter",
          extensions: ["json"],
        },
      ],
    });

    if (path) {
      const contents = await readTextFile(path);
      const json = JSON.parse(contents);

      deckMutation.mutate(json);
    }
  };

  const handleExport = async () => {
    const path = await save({
      filters: [
        {
          name: "Json Filter",
          extensions: ["json"],
        },
      ],
    });

    if (path) {
      const contents = JSON.stringify(deckQuery.data);
      await writeTextFile(path, contents);
    }
  };

  if (settingsQuery.isPending || deckQuery.isPending) {
    return "Loading...";
  }

  if (settingsQuery.isError || deckQuery.isError) {
    return "Error...";
  }

  const formData = {
    host: settingsQuery.data.streamerbot.host ?? "",
    port: settingsQuery.data.streamerbot.port?.toString() ?? "",
    endpoint: settingsQuery.data.streamerbot.endpoint ?? "",
    rows: settingsQuery.data.layout.rows,
    columns: settingsQuery.data.layout.columns,
  };

  return (
    <div className="absolute z-10 flex flex-wrap m-4 left-0 right-0 justify-center">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="m-2">Settings</Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            "overflow-y-auto",
            "max-h-[calc(100dvh-4rem)]",
            "sm:max-w-[calc(100dvw-4rem)]",
            "sm:w-3xl",
          )}
        >
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Touch Deck Settings</DialogDescription>
          </DialogHeader>
          <SettingsForm
            data={formData}
            onSave={handleSave}
            onCancel={handleCancel}
            onImport={handleImport}
            onExport={handleExport}
          />
        </DialogContent>
      </Dialog>
      <ConnectionStatus />
      <Pages
        selectedPageNumber={props.selectedPageNumber}
        onPageChange={props.onPageChange}
      />
    </div>
  );
}
