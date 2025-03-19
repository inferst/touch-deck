import "./App.css";

const ws = new WebSocket("ws://127.0.0.1:3001/ws");

ws.onmessage = (event) => console.log("Received:", JSON.parse(event.data));

ws.onopen = () => {
  ws.send(JSON.stringify({ message: "Hello, Axum!" }));
};

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function App() {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    toggleFullScreen();
    e.preventDefault();
  };

  return (
    <>
      <div onClick={handleClick}>Deck Fullscreen</div>
    </>
  );
}

export default App;
