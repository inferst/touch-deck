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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { XIcon } from "lucide-react";

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);

  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const { data, isSuccess, isPending } = useSettingsQuery();
  const settingsMutation = useSettingsMutation();

  const handleSettingsSave = () => {
    settingsMutation.mutate({
      ...data,
      streamerbot: {
        ...data?.streamerbot,
        host,
        port: Number(port),
        endpoint,
      },
    });

    setIsOpen(false);
  };

  const handleSettingsCancel = () => {
    setIsOpen(false);
  };

  const handleSettingsOpen = (value: boolean) => {
    setIsOpen(value);
    setHost(data?.streamerbot.host ?? "");
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
      <DialogContent className="overflow-y-auto max-h-[calc(100dvh-4rem)] sm:max-w-[calc(100dvw-4rem)] sm:w-5xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Settings Dialog</DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div>Streamer.bot Host</div>
              <div className="flex col-span-3 justify-end">
                <Input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="127.0.0.1"
                  className="w-40 mr-2"
                />
                <Input
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="8080"
                  className="w-40 mr-2"
                />
                <Input
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/"
                  className="w-40"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div>Layout</div>
              <div className="flex col-span-3 items-center justify-end">
                <Select>
                  <SelectTrigger className="w-40 mr-2">
                    <SelectValue placeholder="Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="mr-2">
                  <XIcon size={16} />
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="flex col-end-5 justify-end">
                <Button onClick={handleSettingsSave} className="ml-2">
                  Save Settings
                </Button>
                <Button
                  autoFocus
                  onClick={handleSettingsCancel}
                  className="ml-2"
                  variant={"secondary"}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
