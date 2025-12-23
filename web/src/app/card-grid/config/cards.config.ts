export const CARDS_TOTAL_COUNT = 52;

// Format: "<rank>-of-<suit>"
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

export const CARDS: string[] = SUITS.flatMap((suit) => RANKS.map((rank) => `${rank}-of-${suit}`));
