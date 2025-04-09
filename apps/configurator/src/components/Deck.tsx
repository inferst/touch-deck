import { DeckPage } from "@/components/DeckPage";
import { Settings } from "@/components/Settings/Settings";
import { useState } from "react";

export function Deck() {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <main className="w-full max-h-screen overflow-hidden relative">
      <Settings selectedPageNumber={pageNumber} onPageChange={setPageNumber} />
      <div className="my-[100px] h-[calc(100%-200px)]">
        <DeckPage pageNumber={pageNumber} />
      </div>
    </main>
  );
}
