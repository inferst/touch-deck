import {
  BackgroundSchema,
  IconSchema,
  TitleSchema,
} from "@workspace/deck/types/field";
import {
  StreamerbotActionSchema,
  StreamerbotSwitchSchema,
} from "@workspace/deck/types/streamerbot";
import { z } from "zod";

export const TextAlignSchema = z.union([
  z.literal("bottom"),
  z.literal("middle"),
  z.literal("top"),
]);

export type TextAlign = z.infer<typeof TextAlignSchema>;

export const FontSizeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]);

export type FontSize = z.infer<typeof FontSizeSchema>;

export const IconSizeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]);

export type IconSize = z.infer<typeof IconSizeSchema>;

export const BorderRadiusSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]);

export type BorderRadius = z.infer<typeof BorderRadiusSchema>;

export const SpacingSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

export type Spacing = z.infer<typeof SpacingSchema>;

export const CellDataSchema = z.union([
  StreamerbotActionSchema,
  StreamerbotSwitchSchema,
]);

export type CellData = z.infer<typeof CellDataSchema>;

export const CellSchema = z.object({
  id: z.string(),
  title: TitleSchema.optional(),
  icon: IconSchema.optional(),
  background: BackgroundSchema.optional(),
  data: CellDataSchema.optional(),
});

export type Cell = z.infer<typeof CellSchema>;

export const RowSchema = z.record(z.string(), CellSchema);

export type Row = z.infer<typeof RowSchema>;

export const BoardSchema = z.record(z.string(), RowSchema);

export type Board = z.infer<typeof BoardSchema>;

export const PageSchema = z.object({
  id: z.string(),
  board: BoardSchema,
});

export type Page = z.infer<typeof PageSchema>;

export const DeckSchema = z.object({
  pages: z.array(PageSchema),
});

export type Deck = z.infer<typeof DeckSchema>;

export const RowsCountSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);

export type RowsCount = z.infer<typeof RowsCountSchema>;

export const ColumnsCountSchema = RowsCountSchema;

export type ColumnsCount = z.infer<typeof ColumnsCountSchema>;

export const LayoutSettingsSchema = z.object({
  rows: RowsCountSchema,
  columns: ColumnsCountSchema,
});

export type LayoutSettings = z.infer<typeof LayoutSettingsSchema>;

export const StyleSettingsSchema = z.object({
  spacing: SpacingSchema,
  borderRadius: BorderRadiusSchema,
});

export type StyleSettings = z.infer<typeof StyleSettingsSchema>;

export const StreamerbotConnectionSchema = z.object({
  host: z.ipv4(),
  port: z.int().max(65536).min(0),
  endpoint: z.string(),
});

export type StreamerbotConnection = z.infer<typeof StreamerbotConnectionSchema>;

export const OBSConnectionSchema = z.object({
  host: z.ipv4(),
  port: z.int().max(65536).min(0),
  endpoint: z.string(),
});

export type OBSConnection = z.infer<typeof OBSConnectionSchema>;

export const ConnectionSettingsSchema = z.object({
  streamerbot: StreamerbotConnectionSchema,
  obs: OBSConnectionSchema,
});

export const DeckSettingsSchema = z.object({
  connection: ConnectionSettingsSchema,
  tray: z.boolean(),
  layout: LayoutSettingsSchema,
  style: StyleSettingsSchema,
});

export type DeckSettings = z.infer<typeof DeckSettingsSchema>;
