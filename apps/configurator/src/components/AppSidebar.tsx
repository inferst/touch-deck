import { useActionsQuery } from "@/queries/actions";
import { StreamerbotAction } from "@streamerbot/client";
import { Input } from "@workspace/ui/components/input";
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
} from "@workspace/ui/components/sidebar";
import { useMemo, useState } from "react";

type Groups = {
  [key: string]: StreamerbotAction[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [search, setSearch] = useState("");

  const { data } = useActionsQuery();

  const actions = useMemo(() => {
    if (data) {
      const actions = data.reduce<Groups>((groups, action) => {
        if (!groups[action.group]) {
          groups[action.group] = [];
        }

        groups[action.group].push(action);

        return groups;
      }, {});

      return actions;
    } else {
      return {};
    }
  }, [data]);

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
                      {group || "None"}
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
