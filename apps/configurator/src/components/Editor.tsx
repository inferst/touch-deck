import { DeckEditor } from "@/components/DeckEditor/DeckEditor";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, useCallback, useState } from "react";

export const Editor = memo(() => {
  useLogRenders('Editor');

  const [page, setPage] = useState(0);

  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpened((value) => !value);
  }, []);

  return (
    <div className={cn("w-full", "h-svh", "overflow-hidden", "flex")}>
      <Sidebar isOpened={isSidebarOpened} />
      <div
        className={cn(
          "relative",
          "transition-[left,right,width] duration-200 ease-linear",
          isSidebarOpened ? "w-[calc(100%-300px)]" : "w-full",
        )}
      >
        <Toolbar
          selectedPageNumber={page}
          onPageChange={setPage}
          onSidebarToggle={handleSidebarToggle}
        />
        <div className="mt-[100px] mx-[50px] h-[calc(100%-200px)]">
          <DeckEditor page={page} />
        </div>
        <Footer />
      </div>
    </div>
  );
});
