import { useContext, useEffect, useState } from "react";
import { store } from "./store";
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
import { StreamerbotContext } from "@/streamerbot/streamerbot-context";

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [host, setHost] = useState("");

  const streamerbot = useContext(StreamerbotContext);

  const handleSettingsSave = () => {
    store.set("host", host).then(() => {
      store.save();
    });

    setIsOpen(false);
  };

  useEffect(() => {
    const host = streamerbot?.clientOptions?.host;

    if (host) {
      setHost(host);
    }
  }, [streamerbot?.clientOptions]);

  const handleSettingsOpen = (value: boolean) => {
    setIsOpen(value);
  };

  useEffect(() => {
    store.get<string>("host").then((value) => {
      streamerbot?.setClientOptions({
        host: value,
      });
    });

    const unsubscribe = store.onKeyChange<string>("host", (newValue) => {
      streamerbot?.setClientOptions({
        host: newValue,
      });
    });

    return () => {
      unsubscribe.then((listener) => listener());
    };
  }, []);

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
