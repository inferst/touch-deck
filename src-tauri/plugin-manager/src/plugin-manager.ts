import fs from "fs";
import path from "path";
import { Action } from "./types";

interface IPlugin {
  uuid?: string;
  actions?: Action[];
  enable?: () => void;
  onEvent?: (event: string, data: any) => void;
}

export type Api = {
  log: (text: string) => void;
};

export class PluginManager {
  plugins: IPlugin[] = [];

  actions: Action[] = [];

  constructor(
    readonly pluginsDir: string,
    readonly api: Api,
  ) {}

  async loadPlugins() {
    const dirs = fs.readdirSync(this.pluginsDir);

    for (const folder of dirs) {
      try {
        const pluginPath = path.join(this.pluginsDir, folder);
        const configFile = path.join(pluginPath, "manifest.json");

        if (!fs.existsSync(configFile)) return;

        const config = require(configFile);
        if (!config.enabled) return;

        const entry = path.join(pluginPath, config.main);
        if (!fs.existsSync(entry)) return;

        const { default: PluginClass } = await import(entry);

        const plugin = new PluginClass(this.api);
        plugin.config = config;

        this.plugins.push(plugin);

        plugin.enable?.();

        const actions = plugin.actions ?? [];

        this.actions = [...this.actions, ...actions];

        this.api.log(`Loaded plugin: ${config.name}`);
      } catch (e) {
        console.error(`Error loading plugin in ${folder}`, e);
      }
    }
  }

  emit(event: string, data: any) {
    this.plugins.forEach((p) => p.onEvent?.(event, data));
  }
}
