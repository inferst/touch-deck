import { invoke, isTauri } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

export type StreamerbotStatus = "connected" | "connecting" | "disconnected";

export type ErrorEvent = {
  message: string;
};

export type AppState = {
  status: StreamerbotStatus;
};

interface API {
  emitDeckUpdate(): Promise<unknown>;
  emitSettingsUpdate(): Promise<unknown>;
  getStatus(): Promise<StreamerbotStatus>;
  getDeckURL(): Promise<string>;
  onStatusUpdate(
    handler: (status: StreamerbotStatus) => void,
  ): Promise<UnlistenFn>;
  onErrorUpdate(handler: (error: string) => void): Promise<UnlistenFn>;
}

class TauriAPI implements API {
  emitDeckUpdate(): Promise<unknown> {
    return invoke("deck_update");
  }
  emitSettingsUpdate(): Promise<unknown> {
    return invoke("settings_update");
  }
  getStatus(): Promise<StreamerbotStatus> {
    return invoke<StreamerbotStatus>("get_state");
  }
  getDeckURL(): Promise<string> {
    return invoke<string>("get_deck_url");
  }
  onStatusUpdate(
    handler: (status: StreamerbotStatus) => void,
  ): Promise<UnlistenFn> {
    return listen<AppState>("state_update", (event) => {
      handler(event.payload.status);
    });
  }
  onErrorUpdate(handler: (error: string) => void): Promise<UnlistenFn> {
    return listen<ErrorEvent>("error", (event) => {
      handler(event.payload.message);
    });
  }
}

class LocalAPI implements API {
  emitDeckUpdate(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
  emitSettingsUpdate(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
  getStatus(): Promise<StreamerbotStatus> {
    return Promise.resolve("disconnected");
  }
  getDeckURL(): Promise<string> {
    return Promise.resolve("http://localhost:3000/deck");
  }
  onStatusUpdate(): Promise<UnlistenFn> {
    return Promise.resolve(() => {});
  }
  onErrorUpdate(): Promise<UnlistenFn> {
    return Promise.resolve(() => {});
  }
}

function createApi(isTauri: boolean): API {
  if (isTauri) {
    return new TauriAPI();
  } else {
    return new LocalAPI();
  }
}

export const api = createApi(isTauri());
