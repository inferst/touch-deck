import { DeckEditor } from "@/components/DeckEditor/DeckEditor";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { Loader } from "@/Loader";
import { usePagesQuery } from "@/queries/page";
import { useAppStore } from "@/store/app";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, Suspense, useCallback, useEffect, useState } from "react";

export const Editor = memo(() => {
  useLogRenders("Editor");

  const selectedBoardId = useAppStore((state) => state.selectedBoardId);
  const setSelectedBoardId = useAppStore((state) => state.setSelectedBoard);

  const pagesQuery = usePagesQuery(1);

  useEffect(() => {
    const firstPage = pagesQuery.data[0];

    if (!selectedBoardId && firstPage) {
      setSelectedBoardId(firstPage.page.boardId);
    }
  }, [pagesQuery.data, selectedBoardId, setSelectedBoardId]);

  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpened((value) => !value);
  }, []);

  return (
    <div className={cn("w-full", "h-svh", "overflow-hidden", "flex")}>
      <Sidebar isOpened={isSidebarOpened} />
      {selectedBoardId && (
        <div
          className={cn(
            "relative",
            "transition-[left,right,width] duration-200 ease-linear",
            isSidebarOpened ? "w-[calc(100%-300px)]" : "w-full",
          )}
        >
          <Toolbar
            selectedBoardId={selectedBoardId}
            onSelectedBoardChange={setSelectedBoardId}
            onSidebarToggle={handleSidebarToggle}
          />
          <div className="mt-[100px] mx-[50px] h-[calc(100%-200px)]">
            <Suspense fallback={<Loader />}>
              <DeckEditor boardId={selectedBoardId} />
            </Suspense>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
});
