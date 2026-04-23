import { db } from "./index";
import { cards } from "./schema";
import { eq, asc } from "drizzle-orm";
import type { Card } from "./schema";

export async function getCardById(id: number): Promise<Card | undefined> {
  const result = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
  return result[0];
}

export async function getCardsByDeckId(deckId: number): Promise<Card[]> {
  return db
    .select()
    .from(cards)
    .where(eq(cards.deckId, deckId))
    .orderBy(asc(cards.order));
}