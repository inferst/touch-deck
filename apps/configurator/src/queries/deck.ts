import { store } from "@/store";
import { Deck, DeckPage } from "@/types/deck";
import { useQuery } from "@tanstack/react-query";

async function getDeck(): Promise<Deck> {
  const pages: DeckPage[] = (await store.get("pages")) ?? [
    {
      id: crypto.randomUUID(),
      buttons: {},
    },
  ];

  return { pages };
}

export function useDeckQuery() {
  const query = useQuery({
    queryKey: ["deck"],
    queryFn: () => getDeck(),
  });

  return query;
}
