import {
  DeckEditorSettings,
  DeckEditorSettingsFormData,
} from "@/components/DeckEditor/DeckSettings";
import { useSettingsContext } from "@/context/SettingsContext";
import { useSettingsMutation } from "@/mutations/settings";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, useCallback, useMemo } from "react";

export type SidebarProps = {
  isOpened: boolean;
};

export const Sidebar = memo((props: SidebarProps) => {
  useLogRenders('Sidebar');

  const { isOpened } = props;

  const settings = useSettingsContext();
  const { mutate } = useSettingsMutation();

  const width = useMemo(() => (isOpened ? "300px" : "0"), [isOpened]);

  const handleChange = useCallback(
    (form: DeckEditorSettingsFormData) => {
      if (settings) {
        mutate({ ...settings, ...form });
      }
    },
    [mutate, settings],
  );

  return (
    <div
      className={cn(
        "absolute",
        "overflow-hidden",
        "border-l-2",
        "border-border",
        "bg-muted",
        "right-0",
        "top-0",
        "z-10",
        "h-screen",
        "w-(--width)",
        "transition-[left,right,width,display] duration-200 ease-linear",
      )}
      style={
        {
          "--width": width,
        } as React.CSSProperties
      }
    >
      <div className={cn("p-6", "overflow-hidden", "w-[300px]")}>
        <div className="mb-6">Deck Settings</div>
        <DeckEditorSettings data={settings} onChange={handleChange} />
      </div>
    </div>
  );
});
