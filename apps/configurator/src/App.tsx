import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AppSidebar } from "./components/AppSidebar";
import { DeckGrid } from "./components/DeckGrid";
import { Settings } from "./components/Settings";
import { SidebarProvider } from "./components/ui/sidebar";
import { StreamerbotProvider } from "./streamerbot/streamerbot-context";

const queryClient = new QueryClient();

function App() {
  return (
    <StreamerbotProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <main className="w-full">
            <Settings />
            <DeckGrid />
          </main>
          <AppSidebar side="right" collapsible="none" />
        </SidebarProvider>
      </QueryClientProvider>
    </StreamerbotProvider>
  );
}

export default App;
