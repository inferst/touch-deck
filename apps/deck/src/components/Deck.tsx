import { generateBoard, getCell } from "@workspace/deck/board";
import { DeckGrid } from "@workspace/deck/components/DeckGrid";
import { DeckSettings, DeckSettingsSchema, Deck as DeckType } from "@workspace/deck/types/board";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { ChevronDown, ChevronUp, FullscreenIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { DeckCell } from "./DeckCell";

type Message = {
  name: string;
  payload: unknown;
};

type GetDataPayload = {
  deck: DeckType;
  settings: DeckSettings;
};

function Deck() {
  const [pageNumber, setPageNumber] = useState(0);

  const ref = useRef<HTMLDivElement | null>(null);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `ws://${location.hostname}:3001/ws`,
    {
      reconnectInterval: 10,
      reconnectAttempts: 10,
    },
  );

  const [data, setData] = useState<GetDataPayload>({
    deck: { pages: [] },
    settings: DeckSettingsSchema.parse({}),
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
          console.log(payload);
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

  const page = data.deck.pages[pageNumber];

  const layout = data.settings.layout;

  const pageBoard = useMemo(
    () => generateBoard(layout.rows, layout.columns, page?.board ?? {}),
    [layout, page],
  );

  const handlePrevPageClick = () => {
    setPageNumber((pageNumber) => {
      const prevPage =
        pageNumber - 1 >= 0 ? pageNumber - 1 : data.deck.pages.length - 1;
      return prevPage;
    });
  };

  const handleNextPageClick = () => {
    setPageNumber((pageNumber) => {
      const nextPage = (pageNumber + 1) % data.deck.pages.length;
      return nextPage;
    });
  };

  const handleFullscreen = () => {
    if (ref.current) {
      if (!document.fullscreenElement) {
        ref.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const hasFullscreenButton = document.fullscreenEnabled;

  return (
    <div
      ref={ref}
      style={
        {
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        } as React.CSSProperties
      }
      className="w-full flex h-dvh overflow-hidden select-none"
    >
      <div className="w-full bg-background">
        {page && (
          <DeckGrid
            key={page.id}
            rows={layout.rows}
            columns={layout.columns}
            spacing={data.settings.style.spacing}
            className="flex justify-center items-center h-full grow p-4"
          >
            {(row, col) => {
              const cell = getCell(pageBoard, row, col);
              return (
                cell && (
                  <DeckCell
                    cell={cell}
                    borderRadius={data.settings.style.borderRadius}
                    onPointerDown={handleAction}
                    onPointerUp={handleAction}
                  />
                )
              );
            }}
          </DeckGrid>
        )}
      </div>
      {data.deck.pages.length > 1 && (
        <div className="flex relative justify-center items-center px-6 border-l-2 border-border bg-muted">
          {hasFullscreenButton && (
            <Button
              className="absolute top-4"
              variant={"secondary"}
              size={"icon"}
              onPointerDown={handleFullscreen}
            >
              <FullscreenIcon />
            </Button>
          )}
          <ButtonGroup orientation="vertical">
            <Button
              onPointerDown={handleNextPageClick}
              variant={"secondary"}
              className="size-12 rounded-2xl"
            >
              <ChevronUp className="size-10" />
            </Button>
            <Button variant={"outline"} className="size-12 text-2xl">
              {pageNumber + 1}
            </Button>
            <Button
              onPointerDown={handlePrevPageClick}
              variant={"secondary"}
              className="size-12 rounded-2xl"
            >
              <ChevronDown className="size-10" />
            </Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}

export default Deck;
