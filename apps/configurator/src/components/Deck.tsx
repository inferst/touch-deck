import { DeckPage } from "@/components/DeckPage";
import { Footer } from "@/components/Footer";
import { Settings } from "@/components/Settings/Settings";
import { useState } from "react";

export function Deck() {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <main className="w-full max-h-screen overflow-hidden">
      <Settings selectedPageNumber={pageNumber} onPageChange={setPageNumber} />
      <div className="mt-[100px] h-[calc(100%-200px)] mx-[50px]">
        <DeckPage pageNumber={pageNumber} />
      </div>
      <Footer />
    </main>
  );
}
