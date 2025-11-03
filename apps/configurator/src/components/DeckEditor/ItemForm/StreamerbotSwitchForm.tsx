import { StreamerbotConnectionEdit } from "@/components/DeckEditor/ItemForm/StreamerbotConnectionEdit";
import { useStreamerbotContext } from "@/context/StreamerbotContext";
import { Cell } from "@workspace/deck/types/board";
import { StreamerbotSwitch } from "@workspace/deck/types/streamerbot";
import { Button } from "@workspace/ui/components/button";
import { Combobox } from "@workspace/ui/components/Combobox";
import { FormField } from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { XIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

export type StreamerbotSwitchFormProps = {
  form: UseFormReturn<Cell>;
  data: StreamerbotSwitch;
};

export const StreamerbotSwitchForm = memo(
  (props: StreamerbotSwitchFormProps) => {
    const { data, form } = props;

    const streamerbot = useStreamerbotContext();

    const actions = useMemo(() => {
      return (
        streamerbot.data.actions.map((action) => ({
          value: action.id,
          label: action.name,
        })) ?? []
      );
    }, [streamerbot.data.actions]);

    console.log(form.formState);

    return (
      <>
        <StreamerbotConnectionEdit />
        <div className="grid grid-cols-4 gap-2">
          <Label className="block text-right mt-2.5">Actions</Label>
          <div className="col-span-4 col-start-2">
            <Tabs defaultValue="on">
              <TabsList>
                <TabsTrigger value="on">On</TabsTrigger>
                <TabsTrigger value="off">Off</TabsTrigger>
              </TabsList>
              <TabsContent value="on">
                <FormField
                  control={form.control}
                  name="data.on.action.id"
                  render={({ field }) => (
                    <div className="flex col-span-3">
                      <Combobox
                        value={field.value}
                        items={actions}
                        placeholder="On Action"
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
              </TabsContent>
              <TabsContent value="off">
                <FormField
                  control={form.control}
                  name="data.off.action.id"
                  render={({ field }) => (
                    <div className="flex col-span-3">
                      <Combobox
                        value={field.value}
                        items={actions}
                        placeholder="Off Action"
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* <div className="grid grid-cols-4 items-center gap-4"> */}
        {/*   <Label htmlFor="startActionId" className="block text-right"> */}
        {/*     Start Action */}
        {/*   </Label> */}
        {/* </div> */}
        {/* <div className="grid grid-cols-4 items-center gap-4"> */}
        {/*   <Label htmlFor="endActionId" className="block text-right"> */}
        {/*     End Action */}
        {/*   </Label> */}
        {/*   <FormField */}
        {/*     control={form.control} */}
        {/*     name="releaseActionId" */}
        {/*     render={({ field }) => ( */}
        {/*       <div className="flex"> */}
        {/*         <Combobox */}
        {/*           value={field.value} */}
        {/*           items={actions ?? []} */}
        {/*           placeholder="End Action" */}
        {/*           onChange={(value) => { */}
        {/*             field.onChange(value); */}
        {/*           }} */}
        {/*         /> */}
        {/*         {field.value && ( */}
        {/*           <Button */}
        {/*             onClick={() => { */}
        {/*               field.onChange(""); */}
        {/*             }} */}
        {/*             variant={"ghost"} */}
        {/*           > */}
        {/*             <XIcon /> */}
        {/*           </Button> */}
        {/*         )} */}
        {/*       </div> */}
        {/*     )} */}
        {/*   /> */}
        {/* </div> */}
      </>
    );
  },
);
