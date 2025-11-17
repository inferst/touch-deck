import arg from "arg";
import { Api, PluginManager } from "./plugin-manager";

const args = arg({
  "--plugins-path": String,
  "--port": Number,
});

if (!args["--plugins-path"]) {
  throw Error("No plugin path");
}

if (!args["--port"]) {
  throw Error("No port");
}

const api: Api = {
  log: console.log,
};

const manager = new PluginManager(args["--plugins-path"], api);

manager.loadPlugins().then(async () => {
  connect();
});

function connect() {
  const ws = new WebSocket(`ws://127.0.0.1:${args["--port"]}/ws`);

  ws.onopen = () => {
    console.log("WebSocket client initialized");
  };

  ws.onmessage = (data) => {
    try {
      const message = JSON.parse(data.toString());
      const actions = manager.actions ?? [];

      console.log(data);

      if (message.event == "onPress") {
        for (const action of actions) {
          if (message.data.uuid == action.uuid) {
            action.onPress(message.data);
          }
        }
      }

      if (message.event == "onRelease") {
        for (const action of actions) {
          if (message.data.uuid == action.uuid) {
            action.onRelease();
          }
        }
      }
    } catch (e) {}
  };

  ws.onerror = () => {
    setTimeout(() => {
      connect();
    }, 3000);
  };
}

console.log("Plugin Manager");
