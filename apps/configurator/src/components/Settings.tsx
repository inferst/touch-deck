import { useSettingsMutation } from "@/mutations/settings";
import { useSettingsQuery } from "@/queries/settings";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [host, setHost] = useState("");

  const { data, isSuccess, isPending } = useSettingsQuery();
  const settingsMutation = useSettingsMutation();

  const handleSettingsSave = () => {
    settingsMutation.mutate({
      ...data,
      streamerbot: {
        ...data?.streamerbot,
        host,
      },
    });

    setIsOpen(false);
  };

  const handleSettingsOpen = (value: boolean) => {
    setIsOpen(value);
  };

  useEffect(() => {
    if (isSuccess) {
      setHost(data.streamerbot.host);
    }
  }, [isSuccess, data?.streamerbot]);

  if (isPending) {
    return "Loading...";
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleSettingsOpen}>
      <DialogTrigger asChild>
        <Button className="m-4">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Yo</DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="host" className="text-right">
                Streamer.bot Host
              </Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="127.0.0.1"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Button onClick={handleSettingsSave} className="col-end-5">
                Save Settings
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
