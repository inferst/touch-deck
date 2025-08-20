import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type SettingsFormData = {
  host: string;
  port: string;
  endpoint: string;
  rows: number;
  columns: number;
  tray: boolean;
};

const schema = z.object({
  host: z.string(),
  port: z.string(),
  endpoint: z.string(),
  rows: z.number().min(2).max(8),
  columns: z.number().min(2).max(8),
  tray: z.boolean(),
});

const columnsArr = [2, 3, 4, 5, 6, 7, 8];
const rowsArr = [2, 3, 4, 5, 6, 7, 8];

type SettingsFormProps = {
  data: SettingsFormData;
  onImport: () => void;
  onExport: () => void;
  onSave: (data: SettingsFormData) => void;
  onCancel: () => void;
};

export function SettingsForm(props: SettingsFormProps) {
  const {
    data: { host, port, endpoint, rows, columns, tray },
    onImport,
    onExport,
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
      tray,
    },
  });

  const handleImport = () => {
    onImport();
  };

  const handleExport = () => {
    onExport();
  };

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
              <div className="mr-2">System Tray Icon</div>
              <div className="content-center">
                <FormField
                  control={form.control}
                  name="tray"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        return field.onChange(checked);
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex col-end-5 justify-end">
              <Button type="button" onClick={handleImport} className="ml-2">
                Import
              </Button>
              <Button type="button" onClick={handleExport} className="ml-2">
                Export
              </Button>
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
