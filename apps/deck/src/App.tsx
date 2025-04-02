import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";
import { DeckPage } from "@workspace/deck/types/deck";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

type Response = {
  name: string;
  payload: unknown;
};

function App() {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    "ws://127.0.0.1:3001/ws",
  );

  const [pages, setPages] = useState<DeckPage[]>([]);

  useEffect(() => {
    sendJsonMessage({
      name: "buttons",
    });
  }, [sendJsonMessage]);

  useEffect(() => {
    const message = lastJsonMessage as Response;

    if (message && message.name == "buttons") {
      const payload = message.payload as DeckPage[];
      setPages(payload);
    }

    console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  const rows = 3;
  const columns = 5;

  // const rows = 5;
  // const columns = 3;

  return (
    <div className="flex h-screen overflow-hidden">
      {pages.map((page) => {
        return (
          <DeckGrid
            key={page.id}
            rows={rows}
            columns={columns}
            buttons={page.buttons}
            className="flex justify-center items-center h-full grow"
          />
        );
      })}
      <div className="w-[100px]">Sidebar</div>
    </div>
  );
}

export default App;
