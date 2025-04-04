import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { ComboboxItem } from "@workspace/ui/components/Combobox/Combobox";
import { Form, FormField } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type DeckFormData = {
  title?: string;
  color?: string;
  startActionId?: string;
};

const schema = z.object({
  title: z.string().optional(),
  color: z.string().optional(),
  startActionId: z.string().optional(),
});

type DeckFormProps = {
  data: DeckFormData;
  actions?: ComboboxItem[];
  onSave: (data: DeckFormData) => void;
  onCancel: () => void;
};

export function DeckForm(props: DeckFormProps) {
  const { data, actions, onSave, onCancel } = props;

  const form = useForm<DeckFormData>({
    resolver: zodResolver(schema),
    values: data,
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
            <Label htmlFor="startActionId" className="text-right">
              Start Action
            </Label>
            <FormField
              control={form.control}
              name="startActionId"
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Columns" />
                  </SelectTrigger>
                  <SelectContent>
                    {actions?.map((value) => (
                      <SelectItem key={value.value} value={value.value}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
