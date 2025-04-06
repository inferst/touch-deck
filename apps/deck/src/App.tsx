import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";
import { DeckPage } from "@workspace/deck/types/deck";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

type Message = {
  name: string;
  payload: unknown;
};

type LayoutSettings = {
  rows: number;
  columns: number;
};

type GetDataPayload = {
  pages: DeckPage[];
  layout: LayoutSettings;
};

function App() {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `ws://${location.hostname}:3001/ws`,
  );

  const [data, setData] = useState<GetDataPayload>({
    pages: [],
    layout: {
      rows: 0,
      columns: 0,
    },
  });

  useEffect(() => {
    sendJsonMessage({
      name: "getData",
    });
  }, [sendJsonMessage]);

  useEffect(() => {
    const message = lastJsonMessage as Message;

    if (message) {
      switch (message.name) {
        case "getData": {
          const payload = message.payload as GetDataPayload;
          setData(payload);
        }
      }
    }

    console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  const handleAction = async (id: string) => {
    sendJsonMessage({
      name: "doAction",
      payload: id,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {data.pages.map((page) => {
        return (
          <DeckGrid
            key={page.id}
            rows={data.layout.rows}
            columns={data.layout.columns}
            buttons={page.buttons}
            onActionStart={handleAction}
            onActionEnd={handleAction}
            mode="view"
            className="flex justify-center items-center h-full grow"
          />
        );
      })}
      <div className="w-[100px]">Sidebar</div>
    </div>
  );
}

export default App;
