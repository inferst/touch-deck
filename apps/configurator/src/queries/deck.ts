import { store } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { defaultDeck } from "@workspace/deck/board";
import { Deck, DeckSchema } from "@workspace/deck/types";

async function getDeck(): Promise<Deck> {
  const deck = (await store.get("deck") as Deck) ?? defaultDeck();
  DeckSchema.parse(deck);
  return deck;
}

export function useDeckQuery() {
  const query = useQuery({
    queryKey: ["deck"],
    queryFn: () => getDeck(),
    throwOnError: true,
  });

  return query;
}
