import {
  BackgroundSchema,
  IconSchema,
  TitleSchema,
} from "@workspace/deck/types/field";
import z from "zod";

export const ActionArgumentSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const ActionSchema = z.object({
  id: z.string().optional(),
  arguments: z.array(ActionArgumentSchema).optional(),
});

export const StreamerbotActionSchema = z.object({
  type: z.literal("streamerbot.action"),
  pressAction: ActionSchema.optional(),
  releaseAction: ActionSchema.optional(),
  holdAction: ActionSchema.optional(),
});

export type StreamerbotAction = z.infer<typeof StreamerbotActionSchema>;

export const StreamerbotSwitchSchema = z.object({
  type: z.literal("streamerbot.switch"),
  on: z.object({
    title: TitleSchema.optional(),
    icon: IconSchema.optional(),
    background: BackgroundSchema.optional(),
    action: ActionSchema.optional(),
  }).optional(),
  off: z.object({
    title: TitleSchema.optional(),
    icon: IconSchema.optional(),
    background: BackgroundSchema.optional(),
    action: ActionSchema.optional(),
  }).optional(),
});

export type StreamerbotSwitch = z.infer<typeof StreamerbotSwitchSchema>;

export const StreamerbotIndicatorSchema = z.object({
  type: z.literal("streamerbot.indicator"),
  value: z.string().optional(),
  action: ActionSchema.optional(),
});

export type StreamerbotIndicator = z.infer<typeof StreamerbotIndicatorSchema>;
