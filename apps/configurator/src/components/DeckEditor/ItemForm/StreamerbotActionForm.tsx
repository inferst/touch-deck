import { StreamerbotConnectionEdit } from "@/components/DeckEditor/ItemForm/StreamerbotConnectionEdit";
import { useStreamerbotContext } from "@/context/StreamerbotContext";
import { Cell } from "@workspace/deck/types/board";
import { Button } from "@workspace/ui/components/button";
import { Combobox } from "@workspace/ui/components/combobox";
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

export type StreamerbotActionFormProps = {
  form: UseFormReturn<Cell>;
};

export const StreamerbotActionForm = memo(
  (props: StreamerbotActionFormProps) => {
    const { form } = props;

    const streamerbot = useStreamerbotContext();

    const actions = useMemo(() => {
      return (
        streamerbot.data.actions.map((action) => ({
          value: action.id,
          label: action.name,
        })) ?? []
      );
    }, [streamerbot.data.actions]);

    return (
      <>
        <StreamerbotConnectionEdit />
        <div className="grid grid-cols-4 gap-2">
          <Label className="block text-right mt-2.5">Actions</Label>
          <div className="col-span-4 col-start-2">
            <Tabs defaultValue="press">
              <TabsList>
                <TabsTrigger value="press">Press</TabsTrigger>
                <TabsTrigger value="release">Release</TabsTrigger>
                <TabsTrigger value="hold">Hold</TabsTrigger>
              </TabsList>
              <TabsContent value="press">
                <FormField
                  control={form.control}
                  name="data.pressAction.id"
                  render={({ field }) => (
                    <div className="flex col-span-3">
                      <Combobox
                        value={field.value}
                        items={actions}
                        placeholder="Press Action"
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
              <TabsContent value="release">
                <FormField
                  control={form.control}
                  name="data.releaseAction.id"
                  render={({ field }) => (
                    <div className="flex col-span-3">
                      <Combobox
                        value={field.value}
                        items={actions}
                        placeholder="Release Action"
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
              <TabsContent value="hold">
                <FormField
                  control={form.control}
                  name="data.holdAction.id"
                  render={({ field }) => (
                    <div className="flex col-span-3">
                      <Combobox
                        value={field.value}
                        items={actions}
                        placeholder="Hold Action"
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
