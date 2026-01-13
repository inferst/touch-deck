import { Editor } from "@/components/Editor";
import { Loader } from "@/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";
import { ErrorDialog } from "./components/ErrorDialog";
import { getCurrentWindow } from "@tauri-apps/api/window";

window.addEventListener("load", () => {
  setTimeout(() => {
    getCurrentWindow().show();
  }, 0);
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallbackRender={({ error }) => <ErrorDialog error={error} />}
      >
        <Suspense
          fallback={
            <div className="h-svh">
              <Loader />
            </div>
          }
        >
          <Editor />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
