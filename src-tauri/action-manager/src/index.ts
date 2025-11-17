import { WebSocketServer } from "ws";

import path from "path";
import { Api, PluginManager } from "./plugin-manager";

import { argv } from "node:process";

let pluginsPath = path.resolve(process.cwd(), "plugins");

if (argv[2]) {
  pluginsPath = argv[2];
}

const api: Api = {
  log: console.log,
  notify(msg) {
    console.log("NOTIFY:", msg);
  },
};

const manager = new PluginManager(pluginsPath, api);

manager.loadPlugins().then(() => {
  // manager.emit("greet", { user: "Alice" });
});

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    try {
      const payload = JSON.parse(data.toString());

      manager.emit("doAction", payload);

      console.log("received: %s", data);
    } catch (e) {
      console.error("failed to parse message");
    }
  });

  console.log("Action Manager connection");
});

console.log("Action Manager");
