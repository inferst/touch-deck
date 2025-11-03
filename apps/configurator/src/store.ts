import { isTauri } from "@tauri-apps/api/core";
import { LazyStore } from "@tauri-apps/plugin-store";

interface IStoreAdapter {
  get<T>(key: string): Promise<T | undefined>;

  set(key: string, value: unknown): Promise<void>;

  save(): Promise<void>;
}

class LocalStoreAdapter implements IStoreAdapter {
  constructor(private readonly store: Storage) {}

  get<T>(key: string): Promise<T | undefined> {
    const item = this.store.getItem(key);

    if (item) {
      return Promise.resolve(JSON.parse(item) as T);
    }

    return Promise.resolve(undefined);
  }

  set(key: string, value: unknown): Promise<void> {
    return Promise.resolve(this.store.setItem(key, JSON.stringify(value)));
  }

  save(): Promise<void> {
    return Promise.resolve();
  }
}

class TauriStoreAdapter implements IStoreAdapter {
  constructor(private readonly store: LazyStore) {}

  get<T>(key: string): Promise<T | undefined> {
    return this.store.get<T>(key);
  }

  set(key: string, value: unknown): Promise<void> {
    return this.store.set(key, value);
  }

  save(): Promise<void> {
    return this.store.save();
  }
}

function createStore(isTauri: boolean): IStoreAdapter {
  if (isTauri) {
    const store = new LazyStore("settings.json");
    return new TauriStoreAdapter(store);
  } else {
    return new LocalStoreAdapter(localStorage);
  }
}

export const store = createStore(isTauri());
