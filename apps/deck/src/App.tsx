import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";

const ws = new WebSocket("ws://127.0.0.1:3001/ws");

ws.onmessage = (event) => console.log("Received:", JSON.parse(event.data));

ws.onopen = () => {
  ws.send(JSON.stringify({ message: "Hello, Axum!" }));
};

function App() {
  const rows = 3;
  const columns = 5;

  // const rows = 5;
  // const columns = 3;

  return (
    <div className="flex h-screen overflow-hidden">
      <DeckGrid
        rows={rows}
        columns={columns}
        className="flex justify-center items-center h-full grow"
      />
      <div className="w-[100px]">Sidebar</div>
    </div>
  );
}

export default App;
