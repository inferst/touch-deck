import fs from "fs";
import path from "path";

export type Plugin = {
  name: string;
  init?: () => void;
  onEvent?: (event: string, data: any) => void;
};

export type Api = {
  log: (text: string) => void;
  notify: (msg: string) => void;
};

export class PluginManager {
  plugins: Plugin[] = [];

  constructor(
    readonly pluginsDir: string,
    readonly api: Api,
  ) {
    console.log(pluginsDir);
  }

  async loadPlugins() {
    const dirs = fs.readdirSync(this.pluginsDir);

    console.log(dirs)

    for (const dir of dirs) {
      const pluginPath = path.join(this.pluginsDir, dir);
      const configFile = path.join(pluginPath, "manifest.json");

      if (!fs.existsSync(configFile)) return;

      const config = require(configFile);
      if (!config.enabled) return;

      const entry = path.join(pluginPath, "index.js");
      const pluginFactory = await import(entry);

      console.log("plugin", pluginFactory);

      const plugin = pluginFactory.default(this.api);
      plugin.config = config;

      this.plugins.push(plugin);

      plugin.init?.();
      this.api.log(`Loaded plugin: ${config.name}`);
    }
  }

  emit(event: string, data: any) {
    this.plugins.forEach((p) => p.onEvent?.(event, data));
  }
}
