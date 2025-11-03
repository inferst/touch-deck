import { useSettingsContext } from "@/context/SettingsContext";
import { useStreamerbotContext } from "@/context/StreamerbotContext";
import { useSettingsMutation } from "@/mutations/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StreamerbotConnection,
  StreamerbotConnectionSchema,
} from "@workspace/deck/types/board";
import { Button } from "@workspace/ui/components/button";
import { FormField } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Edit, RefreshCw } from "lucide-react";
import { memo, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

export const StreamerbotConnectionEdit = memo(() => {
  const settings = useSettingsContext();
  const { mutate } = useSettingsMutation();
  const connection = settings.connection.streamerbot;

  const streamerbot = useStreamerbotContext();

  const [errors, setErrors] = useState<FieldErrors<StreamerbotConnection>>({});

  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<StreamerbotConnection>({
    resolver: zodResolver(StreamerbotConnectionSchema),
    defaultValues: connection,
  });

  const onValid = (data: StreamerbotConnection) => {
    setErrors({});

    mutate({
      ...settings,
      connection: {
        ...settings.connection,
        streamerbot: data,
      },
    });

    setIsEdit(false);
  };

  const onInvalid = (errors: FieldErrors<StreamerbotConnection>) => {
    setErrors(errors);
  };

  const handleSave = () => {
    form.handleSubmit(onValid, onInvalid)();
  };

  const handleEdit = () => {
    setIsEdit((value) => !value);
  };

  const handleReconnect = () => {
    streamerbot.reconnect();
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  console.log('StreamerbotConnectionEdit render');

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-2">
        <Label className="block text-right">
          Streamerbot
        </Label>
        <div className="flex col-span-3 leading-none text-sm items-center">
          <span className="w-[82px]">
            {streamerbot.data.status == "disconnected" && (
              <span className="p-1 text-destructive">Offline</span>
            )}
            {streamerbot.data.status == "connected" && (
              <span className="p-1 text-primary">Online</span>
            )}
            {streamerbot.data.status == "connecting" && (
              <span className="p-1">Connecting</span>
            )}
          </span>
          <Button
            type="button"
            size="icon"
            variant={"ghost"}
            title="Edit"
            onClick={handleEdit}
          >
            <Edit />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={"ghost"}
            title="Reconnect"
            onClick={handleReconnect}
          >
            <RefreshCw />
          </Button>
        </div>
      </div>
      {isEdit && (
        <div className="grid grid-cols-4 gap-2 items-center">
          <Label className="block text-right">Host</Label>
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => <Input {...field} className="col-span-3" />}
          />
          <Label className="block text-right">Port</Label>
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <Input
                {...field}
                onChange={(event) => {
                  const number = Number(event.target.value);
                  field.onChange(isNaN(number) ? event.target.value : number);
                }}
                className="col-span-3"
              />
            )}
          />
          <Label className="block text-right">Endpoint</Label>
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => <Input {...field} className="col-span-3" />}
          />
          <div className="text-destructive col-start-2 col-span-3">
            {Object.keys(errors).map((key) => {
              const prop = key as keyof StreamerbotConnection;
              return (
                <p>
                  {prop}: {errors[prop]?.message}
                </p>
              );
            })}
          </div>
          <div className="col-start-2 col-span-3">
            <Button type="button" className="mr-2" onClick={handleSave}>
              Ok
            </Button>
            <Button type="button" variant={"secondary"} onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
});
