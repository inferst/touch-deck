import { invoke } from "@tauri-apps/api/core";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

export function QRCodeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  const [url, setUrl] = useState("");

  useEffect(() => {
    invoke("get_deck_url").then((url) => {
      setUrl(url as string);
    });
  }, []);

  useEffect(() => {
    QRCode.toCanvas(
      ref.current,
      url,
      {
        scale: 8,
      },
      function (error) {
        if (error) console.error(error);
        console.log("success!");
      },
    );
  }, [url]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">Scan with your phone</div>
      <canvas ref={ref}></canvas>
      <div className="mt-4">
        Open in browser -{" "}
        <a href={url} target="_blank" className="text-primary">
          {url}
        </a>
      </div>
    </div>
  );
}
