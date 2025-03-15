import "./App.css";

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
