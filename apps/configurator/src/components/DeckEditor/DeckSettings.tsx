import { useDeckContext } from "@/context/DeckContext";
import { useDeckMutation } from "@/mutations/deck";
import { zodResolver } from "@hookform/resolvers/zod";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { DeckSettingsSchema } from "@workspace/deck/types/board";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField } from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { ImportIcon, XIcon } from "lucide-react";
import { memo, useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

export const DeckEditorSettingsFormSchema = DeckSettingsSchema.pick({
  tray: true,
  layout: true,
  style: true,
});

export type DeckEditorSettingsFormData = z.infer<
  typeof DeckEditorSettingsFormSchema
>;

const columnsArr = [2, 3, 4, 5, 6, 7, 8];
const rowsArr = [2, 3, 4, 5, 6, 7, 8];

export type DeckEditorSettingsProps = {
  data: DeckEditorSettingsFormData;
  onChange: (data: DeckEditorSettingsFormData) => void;
};

export const DeckEditorSettings = memo((props: DeckEditorSettingsProps) => {
  useLogRenders('DeckEditorSettings');

  const { data, onChange } = props;

  const deck = useDeckContext();
  const deckMutation = useDeckMutation();

  const form = useForm<DeckEditorSettingsFormData>({
    resolver: zodResolver(DeckEditorSettingsFormSchema),
    defaultValues: data,
  });

  const values = useWatch<DeckEditorSettingsFormData>({
    control: form.control,
  });

  const handleImport = useCallback(async () => {
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
  }, [deckMutation]);

  const handleExport = useCallback(async () => {
    const path = await save({
      filters: [
        {
          name: "Json Filter",
          extensions: ["json"],
        },
      ],
    });

    if (path) {
      const contents = JSON.stringify(deck);
      await writeTextFile(path, contents);
    }
  }, [deck]);

  useEffect(() => {
    console.log("onChange", values);
    const parsed = DeckEditorSettingsFormSchema.parse(values);
    onChange(parsed);
  }, [values, onChange]);

  return (
    <Form {...form}>
      <Separator className="mb-4" />
      <div className={cn("mb-4")}>Layout</div>
      <div className="flex items-center mb-4">
        <FormField
          control={form.control}
          name="layout.rows"
          render={({ field }) => (
            <Select
              value={field.value.toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className="w-40 mr-2">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {rowsArr.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <div className="mr-2">
          <XIcon size={16} />
        </div>
        <FormField
          control={form.control}
          name="layout.columns"
          render={({ field }) => (
            <Select
              value={field.value.toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Columns" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {columnsArr.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex mb-4">
        <Label className="grow">Spacing</Label>
        <FormField
          control={form.control}
          name="style.spacing"
          render={({ field }) => (
            <Select
              value={(field.value ?? 0).toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                    <SelectItem key={value.toString()} value={value.toString()}>
                      {value.toString()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex mb-4">
        <Label className="grow">Border radius</Label>
        <FormField
          control={form.control}
          name="style.borderRadius"
          render={({ field }) => (
            <Select
              value={(field.value ?? 0).toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Border raduis" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <SelectItem key={value.toString()} value={value.toString()}>
                      {value.toString()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Separator className="mb-4" />
      <div className="flex col-end-5 justify-end">
        <Button
          type="button"
          onClick={handleImport}
          variant={"outline"}
          className="ml-2"
        >
          Import
          <ImportIcon />
        </Button>
        <Button
          type="button"
          onClick={handleExport}
          variant={"ghost"}
          className="ml-2"
        >
          Export
        </Button>
      </div>
    </Form>
  );
});
