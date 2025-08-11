import { useAppContext } from "@/context/AppContext";
import { Button } from "@workspace/ui/components/button";
import { CheckIcon, LoaderCircle } from "lucide-react";

type ConnectionStatusProps = {
  onTryToReconnect?: () => void;
};

function ConnectionStatus(props: ConnectionStatusProps) {
  const context = useAppContext();

  const handleClick = () => {
    props.onTryToReconnect?.();
  };

  return (
    <Button variant={"ghost"} className="m-2">
      {context.status == "connected" && (
        <>
          Connected
          <CheckIcon />
        </>
      )}
      {context.status == "connecting" && (
        <>
          Connecting
          <LoaderCircle className="animate-spin" />
        </>
      )}
      {context.status == "disconnected" && (
        <Button onClick={handleClick}>Try to reconnect</Button>
      )}
    </Button>
  );
}

export { ConnectionStatus };
