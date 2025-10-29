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
    <>
      {context.status == "connected" && (
        <Button variant={"ghost"} className="m-2">
          Connected
          <CheckIcon />
        </Button>
      )}
      {context.status == "connecting" && (
        <Button variant={"ghost"} className="m-2">
          Connecting
          <LoaderCircle className="animate-spin" />
        </Button>
      )}
      {context.status == "disconnected" && (
        <Button onClick={handleClick} className="m-2">
          Try to reconnect
        </Button>
      )}
    </>
  );
}

export { ConnectionStatus };
