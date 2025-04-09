import { useAppContext } from "@/context/AppContext";
import { Button } from "@workspace/ui/components/button";
import { CheckIcon, LoaderCircle } from "lucide-react";

function ConnectionStatus() {
  const context = useAppContext();

  return (
    <Button variant={"ghost"} className="m-2">
      {context.status == "connected" ? (
        <>
          Connected
          <CheckIcon />
        </>
      ) : (
        <>
          Connecting
          <LoaderCircle className="animate-spin" />
        </>
      )}
    </Button>
  );
}

export { ConnectionStatus };
