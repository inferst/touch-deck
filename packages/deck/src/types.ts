import { z } from "zod";

export const CellSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  startActionId: z.string().optional(),
  endActionId: z.string().optional(),
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
