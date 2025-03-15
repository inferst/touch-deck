import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { StreamerbotAction, StreamerbotClient } from "@streamerbot/client";
import { useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";

const client = new StreamerbotClient({
  host: "192.168.1.57",
});

type Groups = {
  [key: string]: StreamerbotAction[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [actions, setActions] = useState<Groups>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    client.connect().then(() => {
      client.getActions().then((data) => {
        const actions = data.actions.reduce<Groups>((groups, action) => {
          if (!groups[action.group]) {
            groups[action.group] = [];
          }

          groups[action.group].push(action);

          return groups;
        }, {});

        setActions(actions);
      });
    });

    return () => {
      client.disconnect();
    };
  }, []);

  const filteredActions = useMemo(() => {
    const filtered: Groups = {};

    for (const group in actions) {
      const groupActions = actions[group].filter((action) =>
        action.name.toLowerCase().includes(search.toLowerCase()),
      );

      if (groupActions.length > 0) {
        filtered[group] = groupActions;
      }
    }

    return filtered;
  }, [actions, search]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(filteredActions).map(([group, actions]) => (
                <SidebarMenuItem key={group}>
                  <SidebarMenuButton
                    asChild
                    draggable={false}
                    variant={"outline"}
                  >
                    <a href="#" className="font-medium">
                      {group || "Default"}
                    </a>
                  </SidebarMenuButton>
                  {actions.length ? (
                    <SidebarMenuSub>
                      {actions.map((action) => (
                        <SidebarMenuSubItem key={action.name}>
                          <SidebarMenuSubButton asChild isActive={false}>
                            <a href="#">{action.name}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
