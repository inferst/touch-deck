import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";
import { DeckPage } from "@workspace/deck/types/deck";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/ButtonGroup";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [pageNumber, setPageNumber] = useState(0);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `ws://${location.hostname}:3001/ws`,
    {
      reconnectInterval: 10,
      reconnectAttempts: 10,
    },
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

  const page = data.pages[pageNumber];

  const handlePrevPageClick = () => {
    const prevPage = pageNumber - 1;

    if (prevPage >= 0) {
      setPageNumber(prevPage);
    }
  };

  const handleNextPageClick = () => {
    const nextPage = pageNumber + 1;

    if (nextPage > 0) {
      setPageNumber(nextPage);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {page && (
        <DeckGrid
          key={page.id}
          rows={data.layout.rows}
          columns={data.layout.columns}
          buttons={page.buttons}
          onActionStart={handleAction}
          onActionEnd={handleAction}
          mode="view"
          className="flex justify-center items-center h-full grow p-4"
        />
      )}
      <div className="flex justify-center items-center mr-4">
        <ButtonGroup orientation="vertical">
          <Button onClick={handlePrevPageClick} className="size-14">
            <ChevronUp className="size-10" />
          </Button>
          <Button variant={"secondary"} className="size-14 text-2xl">
            {pageNumber + 1}
          </Button>
          <Button onClick={handleNextPageClick} className="size-14">
            <ChevronDown className="size-10" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default App;
