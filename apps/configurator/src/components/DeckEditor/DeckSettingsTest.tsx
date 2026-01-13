import { useSetLayoutMutation, useSetStyleMutation } from "@/mutations/profile";
import { useLayoutQuery, useStyleQuery } from "@/queries/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BorderRadius,
  ColumnsCount,
  DeckSettingsSchema,
  RowsCount,
  Spacing,
} from "@workspace/deck/types/board";
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
import { XIcon } from "lucide-react";
import { memo, useEffect } from "react";
// import { useForm } from "@tanstack/react-form";
import { useForm } from "react-hook-form";
import z from "zod";

export const DeckEditorSettingsFormSchema = DeckSettingsSchema.pick({
  layout: true,
  style: true,
});

export type DeckEditorSettingsFormData = z.infer<
  typeof DeckEditorSettingsFormSchema
>;

const columnsArr = [2, 3, 4, 5, 6, 7, 8];
const rowsArr = [2, 3, 4, 5, 6, 7, 8];

export const DeckEditorSettings = memo(() => {
  useLogRenders("DeckEditorSettings", { immediately: true });

  const layout = useLayoutQuery(1);
  const style = useStyleQuery(1);

  const layoutMutation = useSetLayoutMutation();
  const styleMutation = useSetStyleMutation();

  const form = useForm<DeckEditorSettingsFormData>({
    resolver: zodResolver(DeckEditorSettingsFormSchema),
    defaultValues: {
      layout: {
        rows: layout.data.layout.rows as RowsCount,
        columns: layout.data.layout.cols as ColumnsCount,
      },
      style: {
        spacing: style.data.style.spacing as Spacing,
        borderRadius: style.data.style.borderRadius as BorderRadius,
      },
    },
    mode: "onChange",
  });

  // const handleImport = useCallback(async () => {
  //   const path = await open({
  //     filters: [
  //       {
  //         name: "Json Filter",
  //         extensions: ["json"],
  //       },
  //     ],
  //   });
  //
  //   if (path) {
  //     const contents = await readTextFile(path);
  //     const json = JSON.parse(contents);
  //
  //     deckMutation.mutate(json);
  //   }
  // }, [deckMutation]);
  //
  // const handleExport = useCallback(async () => {
  //   const path = await save({
  //     filters: [
  //       {
  //         name: "Json Filter",
  //         extensions: ["json"],
  //       },
  //     ],
  //   });
  //
  //   if (path) {
  //     const contents = JSON.stringify(deck);
  //     await writeTextFile(path, contents);
  //   }
  // }, [deck]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setTimeout(() => {
        if (form.formState.isValid) {
          const parsed = DeckEditorSettingsFormSchema.parse(form.getValues());

          layoutMutation.mutate({
            layout: {
              profileId: 1,
              rows: parsed.layout.rows,
              cols: parsed.layout.columns,
            },
          });

          styleMutation.mutate({
            style: {
              profileId: 1,
              spacing: parsed.style.spacing,
              borderRadius: parsed.style.borderRadius,
              backgroundColor: null,
              backgroundImage: null,
            },
          });
        }
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form, form.watch, layoutMutation, styleMutation]);

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

      {/* <Separator className="mb-4" /> */}
      {/* <div className="flex col-end-5 justify-end"> */}
      {/*   <Button */}
      {/*     type="button" */}
      {/*     onClick={handleImport} */}
      {/*     variant={"outline"} */}
      {/*     className="ml-2" */}
      {/*   > */}
      {/*     Import */}
      {/*     <ImportIcon /> */}
      {/*   </Button> */}
      {/*   <Button */}
      {/*     type="button" */}
      {/*     onClick={handleExport} */}
      {/*     variant={"ghost"} */}
      {/*     className="ml-2" */}
      {/*   > */}
      {/*     Export */}
      {/*   </Button> */}
      {/* </div> */}
    </Form>
  );
});
