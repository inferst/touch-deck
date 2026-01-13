import {
  invoke,
  InvokeArgs,
  InvokeOptions,
  isTauri,
} from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

import { Plugins } from "@workspace/deck/types/plugin";
import { ProfileDto } from "@workspace/deck/dto/ProfileDto";
import { LayoutDto } from "@workspace/deck/dto/LayoutDto";
import { StyleDto } from "@workspace/deck/dto/StyleDto";
import { PageDto } from "@workspace/deck/dto/PageDto";
import { BoardDto } from "@workspace/deck/dto/BoardDto";
import { CreateBoardDto } from "@workspace/deck/dto/CreateBoardDto";
import { CreateActionDto } from "@workspace/deck/dto/CreateActionDto";

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
  getPluginsData(): Promise<Plugins>;
  onStatusUpdate(
    handler: (status: StreamerbotStatus) => void,
  ): Promise<UnlistenFn>;
  onErrorUpdate(handler: (error: string) => void): Promise<UnlistenFn>;

  getProfiles(): Promise<ProfileDto[]>;
  getLayout(profileId: number): Promise<LayoutDto>;
  getStyle(profileId: number): Promise<StyleDto>;
  getPages(profileId: number): Promise<PageDto[]>;
  getBoard(boardId: number): Promise<BoardDto>;
  createBoard(board: CreateBoardDto, createPage: boolean): Promise<null>;
  deleteBoard(id: number): Promise<boolean>;
  setAction(action: CreateActionDto): Promise<null>;
  setLayout(layout: LayoutDto): Promise<null>;
  setStyle(style: StyleDto): Promise<null>;
  swapItems(
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ): Promise<null>;
}

class TauriAPI implements API {
  async invoke<T>(
    command: string,
    args?: InvokeArgs,
    options?: InvokeOptions,
  ): Promise<T> {
    return invoke<T>(command, args, options)
      .then((data) => {
        console.info("Command", data, command, args, options);
        return data;
      })
      .catch((error) => {
        console.error("Command", error, command, args, options);
        throw error;
      });
  }

  emitDeckUpdate(): Promise<unknown> {
    return this.invoke("deck_update");
  }
  emitSettingsUpdate(): Promise<unknown> {
    return this.invoke("settings_update");
  }
  getStatus(): Promise<StreamerbotStatus> {
    return this.invoke<StreamerbotStatus>("get_state");
  }
  getDeckURL(): Promise<string> {
    return this.invoke<string>("get_deck_url");
  }
  getPluginsData(): Promise<Plugins> {
    return this.invoke<Plugins>("get_plugins");
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

  getProfiles(): Promise<ProfileDto[]> {
    return this.invoke<ProfileDto[]>("get_profiles");
  }

  getLayout(profileId: number): Promise<LayoutDto> {
    return this.invoke<LayoutDto>("get_layout", { profileId });
  }

  getStyle(profileId: number): Promise<StyleDto> {
    return this.invoke<StyleDto>("get_style", { profileId });
  }

  getPages(profileId: number): Promise<PageDto[]> {
    return this.invoke<PageDto[]>("get_pages", { profileId });
  }

  getBoard(boardId: number): Promise<BoardDto> {
    return this.invoke<BoardDto>("get_board", { boardId });
  }

  createBoard(board: CreateBoardDto, createPage: boolean): Promise<null> {
    return this.invoke("create_board", { board, createPage });
  }

  deleteBoard(boardId: number): Promise<boolean> {
    return this.invoke<boolean>("delete_board", { boardId });
  }

  setAction(action: CreateActionDto): Promise<null> {
    return this.invoke("set_action", { action });
  }

  setLayout(layout: LayoutDto): Promise<null> {
    return this.invoke("set_layout", { layout: layout.layout });
  }

  setStyle(style: StyleDto): Promise<null> {
    return this.invoke("set_style", { style: style.style });
  }

  swapItems(
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ): Promise<null> {
    return this.invoke("swap_items", { row1, col1, row2, col2 });
  }
}

// class LocalAPI implements API {
//   emitDeckUpdate(): Promise<unknown> {
//     return Promise.resolve(undefined);
//   }
//   emitSettingsUpdate(): Promise<unknown> {
//     return Promise.resolve(undefined);
//   }
//   getStatus(): Promise<StreamerbotStatus> {
//     return Promise.resolve("disconnected");
//   }
//   getPluginsData(): Promise<Plugins> {
//     return Promise.resolve({ plugins: [] });
//   }
//   getDeckURL(): Promise<string> {
//     return Promise.resolve("http://localhost:3000/deck");
//   }
//   onStatusUpdate(): Promise<UnlistenFn> {
//     return Promise.resolve(() => {});
//   }
//   onErrorUpdate(): Promise<UnlistenFn> {
//     return Promise.resolve(() => {});
//   }
//
//   getProfiles(): Promise<ProfileDto[]> {
//     return invoke<ProfileDto[]>("get_profiles");
//   }
//
//   getPages(profileId: number): Promise<PageDto[]> {
//     return invoke<PageDto[]>("get_pages", { profileId });
//   }
//
//   getBoard(boardId: number): Promise<BoardDto> {
//     return invoke<BoardDto>("get_board", { boardId });
//   }
// }

function createApi(isTauri: boolean): API {
  // if (isTauri) {
  //   return new TauriAPI();
  // } else {
  //   return new LocalAPI();
  // }

  return new TauriAPI();
}

export const api = createApi(isTauri());
