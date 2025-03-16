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
import { StreamerbotContext } from "@/streamerbot/streamerbot-context";
import { StreamerbotAction } from "@streamerbot/client";
import { useContext, useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";

type Groups = {
  [key: string]: StreamerbotAction[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [actions, setActions] = useState<Groups>();
  const [search, setSearch] = useState("");

  const streamerbot = useContext(StreamerbotContext);

  useEffect(() => {
    const client = streamerbot?.streamerbotClient;

    if (client) {
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
    } else {
      setActions({});
    }
  }, [streamerbot]);

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
                            <div className="w-full">
                              <a
                                href="#"
                                className="truncate"
                                title={action.name}
                              >
                                {action.name}
                              </a>
                            </div>
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
