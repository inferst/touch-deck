import { Deck } from "@/components/Deck";
import { AppProvider } from "@/context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import "./App.css";
import { StreamerbotProvider } from "./streamerbot/StreamerbotContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StreamerbotProvider>
        <AppProvider>
          <SidebarProvider>
            <Deck />
          </SidebarProvider>
        </AppProvider>
      </StreamerbotProvider>
    </QueryClientProvider>
  );
}

export default App;
