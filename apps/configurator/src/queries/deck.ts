import { store } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Deck, DeckSchema } from "@workspace/deck/types/board";
import z from "zod";

export const DeckDefaultSchema = z.object({
  pages: DeckSchema.shape.pages.catch([
    {
      id: crypto.randomUUID(),
      board: {},
    },
  ]),
});

async function getDeck(): Promise<Deck> {
  const deck = (await store.get("deck")) ?? {};

  try {
    const parsed = DeckDefaultSchema.parse(deck);
    return parsed;
  } catch (error) {
    console.error("Missing default fields", error);
    throw error;
  }
}

export function useDeckQuery() {
  const query = useQuery({
    queryKey: ["deck"],
    queryFn: () => getDeck(),
    throwOnError: true,
  });

  return query;
}
