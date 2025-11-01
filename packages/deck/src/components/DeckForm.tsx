import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Combobox, ComboboxItem } from "@workspace/ui/components/Combobox";
import { Form, FormField } from "@workspace/ui/components/form";
import { Icon, icons } from "@workspace/ui/components/Icon";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { VirtualizedCombobox } from "@workspace/ui/components/VirtualizedCombobox";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const iconItems = icons.map((icon) => ({
  value: icon,
  label: icon,
  icon: <Icon name={icon} />,
}));

export type DeckFormData = {
  id: string;
  title?: string;
  color?: string;
  icon?: string;
  startActionId?: string;
  endActionId?: string;
};

const schema = z.object({
  id: z.string(),
  title: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  startActionId: z.string().optional(),
  endActionId: z.string().optional(),
});

type DeckFormProps = {
  data: DeckFormData;
  actions?: ComboboxItem[];
  onSave: (data: DeckFormData) => void;
  onCancel: () => void;
};

export function DeckForm(props: DeckFormProps) {
  const { data, actions, onSave } = props;

  const form = useForm<DeckFormData>({
    resolver: zodResolver(schema),
    values: data,
    defaultValues: {
      id: crypto.randomUUID(),
      title: "",
      color: "#111",
      icon: "",
      startActionId: "",
      endActionId: "",
    },
  });

  const handleSubmit = (data: DeckFormData) => {
    onSave(data);
  };

  const uuid = crypto.randomUUID();

  return (
    <Form {...form}>
      <form id={uuid} name={uuid} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => <Input className="w-40 mr-2" {...field} />}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <Input
                  type="color"
                  className="p-1 h-9 w-9 block cursor-pointer rounded-lg"
                  {...field}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <div className="flex">
                  <VirtualizedCombobox
                    value={field.value}
                    items={iconItems ?? []}
                    placeholder="Icon"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                  {field.value && (
                    <Button
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startActionId" className="text-right">
              Start Action
            </Label>
            <FormField
              control={form.control}
              name="startActionId"
              render={({ field }) => (
                <div className="flex">
                  <Combobox
                    value={field.value}
                    items={actions ?? []}
                    placeholder="Start Action"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                  {field.value && (
                    <Button
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endActionId" className="text-right">
              End Action
            </Label>
            <FormField
              control={form.control}
              name="endActionId"
              render={({ field }) => (
                <div className="flex">
                  <Combobox
                    value={field.value}
                    items={actions ?? []}
                    placeholder="End Action"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                  {field.value && (
                    <Button
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
