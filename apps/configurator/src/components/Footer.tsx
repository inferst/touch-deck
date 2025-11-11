import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { memo } from "react";
import { QRCodeCanvas } from "./QRCode/QRCode";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";

export const Footer = memo(() => {
  useLogRenders('Footer');

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-wrap p-4 left-0 right-0 bottom-0",
        "border-t-2",
        "border-t-border",
      )}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Deck</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Scan with your phone
            </DialogTitle>
            <DialogDescription className="text-center">
              Make sure your phone in the same wifi network
            </DialogDescription>
          </DialogHeader>
          <QRCodeCanvas />
        </DialogContent>
      </Dialog>
    </div>
  );
});
