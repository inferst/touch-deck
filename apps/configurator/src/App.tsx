import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AppSidebar } from "./components/AppSidebar";
import { DeckGrid } from "./components/Deck/DeckGrid";
import { Settings } from "./components/Settings/Settings";
import { SidebarProvider } from "./components/ui/sidebar";
import { StreamerbotProvider } from "./streamerbot/StreamerbotContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StreamerbotProvider>
        <SidebarProvider>
          <main className="w-full max-h-screen overflow-hidden">
            <Settings />
            <DeckGrid />
          </main>
          <AppSidebar side="right" collapsible="none" />
        </SidebarProvider>
      </StreamerbotProvider>
    </QueryClientProvider>
  );
}

export default App;
