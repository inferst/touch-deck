import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type SettingsFormData = {
  host?: string;
  port?: number;
  endpoint?: string;
  rows: number;
  columns: number;
};

const schema = z.object({
  host: z.string().optional(),
  port: z.number().optional(),
  endpoint: z.string().optional(),
  rows: z.number().min(2).max(8),
  columns: z.number().min(2).max(8),
});

const columnsArr = [2, 3, 4, 5, 6, 7, 8];
const rowsArr = [2, 3, 4, 5, 6, 7, 8];

type SettingsFormProps = {
  data: SettingsFormData;
  onSave: (data: SettingsFormData) => void;
  onCancel: () => void;
};

export function SettingsForm(props: SettingsFormProps) {
  const {
    data: { host, port, endpoint, rows, columns },
    onSave,
    onCancel,
  } = props;

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(schema),
    values: {
      host,
      port,
      endpoint,
      rows,
      columns,
    },
  });

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = (data: SettingsFormData) => {
    onSave(data);
  };

  const uuid = crypto.randomUUID();

  return (
    <Form {...form}>
      <form id={uuid} name={uuid} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div>Streamer.bot</div>
            <div className="flex col-span-3 justify-end">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <Input
                    placeholder="127.0.0.1"
                    className="w-40 mr-2"
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <Input placeholder="8080" className="w-40 mr-2" {...field} />
                )}
              />
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <Input placeholder="/" className="w-40" {...field} />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div>Layout</div>
            <div className="flex col-span-3 items-center justify-end">
              <FormField
                control={form.control}
                name="rows"
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
                name="columns"
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex col-end-5 justify-end">
              <Button type="submit" className="ml-2">
                Save Settings
              </Button>
              <Button
                type="button"
                autoFocus
                onClick={handleCancel}
                className="ml-2"
                variant={"secondary"}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
