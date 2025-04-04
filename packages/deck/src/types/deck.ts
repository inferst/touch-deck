export type DeckButton = {
  id: number;
  title?: string;
  color?: string;
  icon?: string;
  startActionId?: string;
  endActionId?: string;
};

export type DeckButtons = {
  [key in string]: DeckButton;
};

export type DeckPage = {
  id: string;
  buttons: DeckButtons;
};

export type DeckMode = 'edit' | 'view';
