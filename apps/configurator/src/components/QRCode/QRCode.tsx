import { api } from "@/api";
import { useLogRenders } from "@workspace/utils/debug";
import QRCode from "qrcode";
import { memo, useEffect, useRef, useState } from "react";

export const QRCodeCanvas = memo(() => {
  useLogRenders('QRCodeCanvas');

  const ref = useRef<HTMLCanvasElement>(null);

  const [url, setUrl] = useState("");

  useEffect(() => {
    api.getDeckURL().then((url) => {
      setUrl(url);
    });
  }, []);

  useEffect(() => {
    if (url) {
      QRCode.toCanvas(
        ref.current,
        url,
        {
          scale: 8,
        },
        function (error) {
          if (error) console.error(error);
        },
      );
    }
  }, [url]);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas ref={ref}></canvas>
      <div className="mt-4">
        Open in browser -{" "}
        <a href={url} target="_blank" className="text-primary">
          {url}
        </a>
      </div>
    </div>
  );
});
