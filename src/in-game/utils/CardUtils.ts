export namespace CardUtils {
  // Добавили Unknown
  export const Suit = {
    Spades: "Spades",
    Hearts: "Hearts",
    Diamonds: "Diamonds",
    Clubs: "Clubs",
    Unknown: "Unknown", 
  } as const;
  export type Suit = typeof Suit[keyof typeof Suit];

  export const Rank = {
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 11,
    Queen: 12,
    King: 13,
    Ace: 14,
    Unknown: 0,
  } as const;
  export type Rank = typeof Rank[keyof typeof Rank];

  export interface Card {
    suit: Suit;
    rank: Rank;
  }

  export interface TableTurn {
    attackCard: Card;
    defendCard?: Card;
  }

  // Новая enum-подобная структура для Location
  export const Location = {
    Empty: "Empty",
    Player: "Player",
    Hand: "Hand",
    Deck: "Deck",
    Table: "Table",
    Draft: "Draft",
  } as const;
  export type Location = typeof Location[keyof typeof Location];

  const suitToChar: { [key in Suit]: string } = {
    [Suit.Spades]: "S",
    [Suit.Hearts]: "H",
    [Suit.Diamonds]: "D",
    [Suit.Clubs]: "C",
    [Suit.Unknown]: "U",
  };

  const charToSuit: { [key: string]: Suit } = {
    S: Suit.Spades,
    H: Suit.Hearts,
    D: Suit.Diamonds,
    C: Suit.Clubs,
    U: Suit.Unknown,
  };

  export function getCardImagePath(skin: string, suit: Suit, rank: Rank): string {
    return `/assets/cards/skins/${skin}/${suit}_${rank}.svg`;
  }

  export function getEveryCardImagePaths(skin: string, addBack: boolean): string[] {
    const urls: string[] = [];
    Object.values(Suit).forEach((suit) => {
      Object.values(Rank).forEach((rank) => {
        let url : string = getCardImagePath(skin, suit, rank);
        if(addBack && suit === Suit.Unknown && rank === Rank.Unknown) urls.push(url);
        if (suit === Suit.Unknown || rank === Rank.Unknown) return;
        urls.push(url);
      });
    });

    return urls;
  }

  export function getCardName(suit: Suit, rank: Rank): string {
    return `${suit}_${rank}`;
  }

  export function tryParseCardCode(code: string, outCard: { card?: Card }): boolean {
    if (!code) return false;
    const rankPart = code.slice(0, -1);
    const suitPart = code.slice(-1);
    const suit = charToSuit[suitPart];
    if (!suit) return false;
    const rank = parseInt(rankPart, 10);
    if (!(Object.values(Rank) as Rank[]).includes(rank as Rank)) return false;
    outCard.card = { suit, rank: rank as Rank };
    return true;
  }

  export function getCardCode(card: Card): string {
    if (!card.suit || !card.rank) return "";
    const suitCode = suitToChar[card.suit];
    return `${card.rank}${suitCode}`;
  }

  export function getEveryCard(addBack: boolean): Card[] {
    const cards: Card[] = [];
    Object.values(Suit).forEach((suit) => {
      Object.values(Rank).forEach((rank) => {
        if(addBack && suit === Suit.Unknown && rank === Rank.Unknown) cards.push({ suit, rank });
        if (suit === Suit.Unknown || rank === Rank.Unknown) return;
        cards.push({ suit, rank });
      });
    });

    return cards;
  }
}
