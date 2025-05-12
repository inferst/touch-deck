import { DeckPage } from "@/components/DeckPage";
import { Footer } from "@/components/Footer";
import { Settings } from "@/components/Settings/Settings";
import { useState } from "react";

export function Deck() {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <main className="w-[calc(100%-100px)] ml-[50px] max-h-screen overflow-hidden relative">
      <Settings selectedPageNumber={pageNumber} onPageChange={setPageNumber} />
      <div className="mt-[100px] h-[calc(100%-200px)]">
        <DeckPage pageNumber={pageNumber} />
      </div>
      <Footer />
    </main>
  );
}
