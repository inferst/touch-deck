import {
  SettingsForm,
  SettingsFormData,
} from "@/components/Settings/SettingsForm";
import { useSettingsMutation } from "@/mutations/settings";
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
import { useMemo, useState } from "react";

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isError, isPending } = useSettingsQuery();

  const { mutate } = useSettingsMutation();

  const handleSave = (formData: SettingsFormData) => {
    const current = data ?? {
      streamerbot: {},
      layout: {},
    };

    mutate({
      ...current,
      streamerbot: {
        ...current.streamerbot,
        host: formData.host,
        port: formData.port,
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

  if (isPending) {
    return "Loading...";
  }

  if (isError) {
    return "Error...";
  }

  const formData = useMemo(
    () => ({
      host: data.streamerbot.host,
      port: data.streamerbot.port,
      endpoint: data.streamerbot.endpoint,
      rows: data.layout.rows,
      columns: data.layout.columns,
    }),
    [data],
  );

  return (
    <div className="absolute z-10">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="m-4">Settings</Button>
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
            <DialogDescription>Settings Dialog</DialogDescription>
          </DialogHeader>
          <SettingsForm
            data={formData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
