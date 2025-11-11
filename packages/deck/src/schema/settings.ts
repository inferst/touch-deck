import {
  LayoutSettingsSchema,
  StyleSettingsSchema,
  StreamerbotConnectionSchema,
  OBSConnectionSchema,
  DeckSettingsSchema,
} from "@workspace/deck/types/board";
import z from "zod";

export const LayoutSettingsDefaultSchema = z.object({
  rows: LayoutSettingsSchema.shape.rows.catch(3),
  columns: LayoutSettingsSchema.shape.columns.catch(5),
});

export const StyleSettingsDefaultSchema = z.object({
  spacing: StyleSettingsSchema.shape.spacing.catch(4),
  borderRadius: StyleSettingsSchema.shape.borderRadius.catch(4),
});

export const StreamerbotDefaultSchema = z.object({
  host: StreamerbotConnectionSchema.shape.host.catch("127.0.0.1"),
  port: StreamerbotConnectionSchema.shape.port.catch(8080),
  endpoint: StreamerbotConnectionSchema.shape.endpoint.catch("/"),
});

export const OBSDefaultSchema = z.object({
  host: OBSConnectionSchema.shape.host.catch("127.0.0.1"),
  port: OBSConnectionSchema.shape.port.catch(4455),
  endpoint: OBSConnectionSchema.shape.endpoint.catch("/"),
});

export const ConnectionSettingsDefaultSchema = z.object({
  streamerbot: StreamerbotDefaultSchema.catch(
    StreamerbotDefaultSchema.parse({}),
  ),
  obs: OBSDefaultSchema.catch(OBSDefaultSchema.parse({})),
});

export const DeckSettingsDefaultSchema = z.object({
  connection: ConnectionSettingsDefaultSchema.catch(
    ConnectionSettingsDefaultSchema.parse({}),
  ),
  tray: DeckSettingsSchema.shape.tray.catch(false),
  layout: LayoutSettingsDefaultSchema.catch(
    LayoutSettingsDefaultSchema.parse({}),
  ),
  style: StyleSettingsDefaultSchema.catch(StyleSettingsDefaultSchema.parse({})),
});
