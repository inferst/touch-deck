import { Deck } from "@/components/Deck/Deck";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import "./App.css";
import { AppSidebar } from "./components/AppSidebar";
import { Settings } from "./components/Settings/Settings";
import { StreamerbotProvider } from "./streamerbot/StreamerbotContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StreamerbotProvider>
        <SidebarProvider>
          <main className="w-full max-h-screen overflow-hidden">
            <Settings />
            <div className="my-[100px] h-[calc(100%-200px)]">
              <Deck />
            </div>
          </main>
          <AppSidebar side="right" collapsible="none" />
        </SidebarProvider>
      </StreamerbotProvider>
    </QueryClientProvider>
  );
}

export default App;
