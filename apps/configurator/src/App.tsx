import "./App.css";
import { AppSidebar } from "./components/AppSidebar";
import { DeckGrid } from "./components/DeckGrid";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  return (
    <SidebarProvider>
      <main className="w-full">
        <DeckGrid />
      </main>
      <AppSidebar side="right" collapsible="none" />
    </SidebarProvider>
  );
}

export default App;
