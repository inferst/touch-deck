import { Editor } from "@/components/Editor";
import { AppProvider } from "@/context/AppContext";
import { DeckProvider } from "@/context/DeckContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { ErrorDialog } from "./components/ErrorDialog";
import { StreamerbotProvider } from "@/context/StreamerbotContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <DeckProvider>
          <StreamerbotProvider>
            <AppProvider>
              <Editor />
              <ErrorDialog />
            </AppProvider>
          </StreamerbotProvider>
        </DeckProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
