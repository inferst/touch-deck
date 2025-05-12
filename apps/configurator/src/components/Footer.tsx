import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { DialogHeader } from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { QRCodeCanvas } from "./QRCode/QRCode";

export function Footer() {
  return (
    <div className="absolute z-10 flex flex-wrap m-4 left-0 right-0 bottom-0 justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="m-2">Open Deck</Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            "overflow-y-auto",
            "max-h-[calc(100dvh-4rem)]",
            "sm:max-w-[calc(100dvw-4rem)]",
            "sm:w-3xl",
          )}
        >
          <QRCodeCanvas />
        </DialogContent>
      </Dialog>
    </div>
  );
}
