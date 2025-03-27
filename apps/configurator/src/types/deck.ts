import { DeckButton } from "@workspace/deck/types/deck";

export type DeckButtons = {
  [key in string]: DeckButton;
};

export type DeckPage = {
  id: string;
  buttons: DeckButtons;
};

export type Deck = {
  pages: DeckPage[];
};
