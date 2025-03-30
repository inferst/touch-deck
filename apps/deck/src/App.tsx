import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

function App() {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    "ws://127.0.0.1:3001/ws",
  );

  useEffect(() => {
    sendJsonMessage({
      message: "Hello, Axum!",
    });
  }, [sendJsonMessage]);

  useEffect(() => {
    console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log('Test');
  }, []);

  const rows = 3;
  const columns = 5;

  // const rows = 5;
  // const columns = 3;

  return (
    <div className="flex h-screen overflow-hidden">
      <DeckGrid
        rows={rows}
        columns={columns}
        buttons={{}}
        className="flex justify-center items-center h-full grow"
      />
      <div className="w-[100px]">Sidebar</div>
    </div>
  );
}

export default App;
