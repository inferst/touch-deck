import { IconPicker } from "@/components/DeckEditor/ItemForm/IconPicker";
import { useSettingsContext } from "@/context/SettingsContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeckGridItem } from "@workspace/deck/components/DeckGridItem";
import { Cell, CellSchema } from "@workspace/deck/types/board";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { XIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { FieldErrors, useForm, useWatch } from "react-hook-form";

const now = Date.now();

type DeckEditorItemFormProps = {
  cell: Cell;
  pluginUuid?: string;
  onSave: (data: Cell) => void;
  onCancel: () => void;
};

export const DeckEditorItemForm = memo((props: DeckEditorItemFormProps) => {
  useLogRenders("DeckEditorItemForm");

  const [pluginState, setPluginState] = useState({});

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { cell, pluginUuid, onSave, onCancel } = props;

  const settings = useSettingsContext();

  const form = useForm<Cell>({
    resolver: zodResolver(CellSchema),
    defaultValues: {
      title: { title: "" },
      icon: { icon: "" },
      background: { color: "#000000" },
      ...cell,
    },
  });

  const [title, background, icon] = useWatch({
    control: form.control,
    name: ["title", "background", "icon"],
  });

  const handleSubmit = (data: Cell) => {
    onSave({ ...data, data: pluginState });
  };

  const handleInvalid = (errors: FieldErrors) => {
    console.log(errors, form.getValues());
  };

  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      console.log(event.data);

      if (event.data.type == "data") {
        console.log('setPluginState')
        setPluginState(event.data.data);
      } else if (event.data.type == "ready") {
        const iframe = iframeRef.current;

        if (iframe && iframe.contentWindow) {

          console.log('parent', cell);
          iframe.contentWindow.postMessage(
            { type: "data", data: cell.data },
            "http://localhost:3001",
          );
        }
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [iframeRef, cell]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}>
        <div className="flex gap-2">
          <div className={cn("flex w-[100px] h-[100px]", "shrink-0")}>
            <DeckGridItem
              text={title?.title}
              backgroundColor={background?.color}
              icon={icon?.icon}
              borderRadius={settings.style.borderRadius}
              borderWidth={2}
            />
          </div>
          <div className="">
            <ScrollArea className="h-[340px] h-sm:h-[380px] h-md:h-[440px] pr-4">
              <div className="grid gap-2">
                <div className="grid grid-cols-4 gap-2 items-center">
                  <Label htmlFor="title" className="block text-right">
                    Title
                  </Label>
                  <FormField
                    control={form.control}
                    name="title.title"
                    render={({ field }) => (
                      <Input className="mr-2 col-span-3 w-full" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <Label htmlFor="color" className="block text-right">
                    Color
                  </Label>
                  <FormField
                    control={form.control}
                    name="background.color"
                    render={({ field }) => (
                      <Input
                        type="color"
                        className="pt-[2px] px-[3px] pb-0 m-0 h-7 w-7 block cursor-pointer"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <Label htmlFor="icon" className="block text-right">
                    Icon
                  </Label>
                  <FormField
                    control={form.control}
                    name="icon.icon"
                    render={({ field }) => (
                      <div className="flex">
                        <IconPicker
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                        {field.value && (
                          <Button
                            type="button"
                            onClick={() => {
                              field.onChange("");
                            }}
                            variant={"ghost"}
                          >
                            <XIcon />
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </div>
                {pluginUuid && (
                  <iframe
                    ref={iframeRef}
                    width="100%"
                    height="100%"
                    src={`http://localhost:3001/plugin/${pluginUuid}/editor/index.html?actionUuid=${cell.type}&date=${now}`}
                  />
                )}
              </div>
            </ScrollArea>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="flex col-start-2">
                <Button type="submit" className="mr-2">
                  Save
                </Button>
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
});
