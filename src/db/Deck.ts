import { db } from "./index";
import { decks, cards } from "./schema";
import { eq, asc } from "drizzle-orm";
import type { Deck } from "./schema";

export async function getDeckById(id: number): Promise<Deck | undefined> {
  const result = await db.select().from(decks).where(eq(decks.id, id)).limit(1);
  return result[0];
}

export async function getDecksByUserId(userId: string): Promise<
  Array<{
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    cardCount: number;
    updatedAt: Date;
  }>
> {
  const userDecks = await db
    .select({
      id: decks.id,
      name: decks.name,
      description: decks.description,
      category: decks.category,
      updatedAt: decks.updatedAt,
      cardCount: cards.id,
    })
    .from(decks)
    .leftJoin(cards, eq(decks.id, cards.deckId))
    .where(eq(decks.userId, userId))
    .orderBy(asc(decks.name));

  const deckMap = new Map<
    number,
    { id: number; name: string; description: string | null; category: string | null; cardCount: number; updatedAt: Date }
  >();
  for (const row of userDecks) {
    if (!deckMap.has(row.id)) {
      deckMap.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        cardCount: 0,
        updatedAt: row.updatedAt,
      });
    }
    if (row.cardCount) {
      const deck = deckMap.get(row.id);
      if (deck) deck.cardCount++;
    }
  }

  return Array.from(deckMap.values());
}