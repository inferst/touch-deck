import { LazyStore } from "@tauri-apps/plugin-store";

export const store = new LazyStore("settings.json");

export async function setDefaultSettings() {
  await store.set("streamerbot", {
    host: null,
    port: null,
    endpoint: null,
  });

  await store.set("layout", {
    rows: 3,
    columns: 5,
  });

  await store.save();
}
