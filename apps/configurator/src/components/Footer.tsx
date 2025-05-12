import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { QRCodeCanvas } from "./QRCode/QRCode";

export function Footer() {
  return (
    <div className="absolute z-10 flex flex-wrap m-4 left-0 right-0 bottom-0 justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="m-2">Open Deck</Button>
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
}
