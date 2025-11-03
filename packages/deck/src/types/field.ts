import z from "zod";

export const TitleSchema = z.object({
  title: z.string().optional(),
  color: z.string().optional(),
  font: z.string().optional(),
  align: z
    .union([z.literal("top"), z.literal("middle"), z.literal("bottom")])
    .optional(),
});

export type Title = z.infer<typeof TitleSchema>;

export const IconSchema = z.object({
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type Icon = z.infer<typeof IconSchema>;

export const BackgroundSchema = z.object({
  color: z.string().optional(),
  image: z.string().optional(),
});

export type Background = z.infer<typeof BackgroundSchema>;
