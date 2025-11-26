// ----------------------------
// TYPES
// ----------------------------

export type ElementType = "fire" | "water" | "earth" | "air" | "lightning";

export type CardCost = Partial<Record<ElementType, number>>;


export type Keyword =
  | { type: "Ignite"; amount: number } // e.g., Ignite 2
  | { type: "Combustion"; amount: number } // Current idea: (Debuff) Combustion (1) - 1 attack from enemy minion explodes all allies for 1 damage, Combusition (3) - 3 attacks for 3 damage to all allies
  | { type: "Flow"; amount: number } // Current idea: (Cost Change) Flow (2) - Sacrifice 2 waveling tokens to cast this card for free
  | { type: "Taunt" }
  | { type: "Charge" }
  | { type: "Growth"; amount: number }; // Current idea: Grow mana once card has survived a turn

export type CardType = "unit" | "spell" | "structure" | "herald";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface CardDefinition {
  id: number;
  type: CardType;
  name: string;
  rarity: Rarity;
  attack?: number;
  defense?: number; // currently optional so spells can omit it
  cost?: CardCost;
  keywords?: Keyword[];
  text?: string;
  image?: string; // future support
}

// ----------------------------
// CARD LIST
// ----------------------------

export const Cards: Record<number, CardDefinition> = {
  1: {
    id: 1,
    type: "unit",
    name: "Pyre Elemental",
    rarity: "common",
    attack: 3,
    defense: 2,
    cost: { fire: 1 },
    keywords: [{ type: "Ignite", amount: 2 }],
    text: "Ignite: Deal 2 damage to the enemy hero."
  },
  2: {
    id: 2,
    type: "spell",
    name: "Aqueous Shield",
    rarity: "rare",
    cost: { water: 2 },
    keywords: [{ type: "Flow", amount: 2 }],
    text: "Give a friendly unit +4 defense this turn."
  }
};

// ----------------------------
// HELPERS
// ----------------------------

// Returns array form
export const CardList = Object.values(Cards);

// Helper - get by ID
export const getCard = (id: number) => Cards[id];