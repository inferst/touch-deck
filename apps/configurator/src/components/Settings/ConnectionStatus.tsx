import { useAppContext } from "@/context/AppContext";
import { Button } from "@workspace/ui/components/button";
import { CheckIcon, LoaderCircle } from "lucide-react";

function ConnectionStatus() {
  const context = useAppContext();

  return (
    <Button variant={"ghost"} className="m-4">
      {context.status == "connected" ? (
        <CheckIcon />
      ) : (
        <LoaderCircle className="animate-spin" />
      )}
    </Button>
  );
}

export { ConnectionStatus };
