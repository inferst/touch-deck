export type StreamerbotSettings = {
  host?: string;
  port?: number;
  endpoint?: string;
};

export type LayoutSettings = {
  rows: number;
  columns: number;
};

export type Settings = {
  streamerbot: StreamerbotSettings;
  layout: LayoutSettings;
  tray: boolean;
};
