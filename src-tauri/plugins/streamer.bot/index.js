import os from "os";
import { StreamerbotClient } from "@streamerbot/client";

let client = new StreamerbotClient({
  host: "192.168.1.57",
  autoReconnect: false,
  immediate: false,
  retries: 0,
  onConnect() {
    console.log("streamerbot connected");
  },
  onError(err) {
    console.error("streamerbot error", err);
  },
});

export default (api) => {
  return {
    name: "streamer.bot",

    init() {
      api.log("Streamer.bot initialized");
      client.connect();
    },

    onEvent(event, data) {
      if (event === "greet") {
        api.log("Hello plugin received event: greet");
        api.log(os.cpus());
      }

      if (event == "doAction") {
        try {
          console.log(data);
          client.doAction(data.payload);
        } catch (e) {
          console.error("onEvent error", e);
        }
      }
    },
  };
};
