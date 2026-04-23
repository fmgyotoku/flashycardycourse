"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { createCardSchema, updateCardSchema } from "@/lib/schemas";
import type { CreateCardInput, UpdateCardInput } from "@/lib/schemas";
import { eq, and } from "drizzle-orm";

export async function createCard(data: CreateCardInput) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const deck = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, data.deckId), eq(decks.userId, userId)))
    .limit(1);
  if (deck.length === 0) {
    throw new Error("Deck not found");
  }

  const validated = createCardSchema.parse(data);

  const result = await db.insert(cards).values(validated).returning();

  revalidatePath("/dashboard");

  return result[0];
}

export async function updateCard(id: number, data: UpdateCardInput) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingCard = await db
    .select()
    .from(cards)
    .where(eq(cards.id, id))
    .limit(1);
  if (existingCard.length === 0) {
    throw new Error("Card not found");
  }

  const deck = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, existingCard[0].deckId), eq(decks.userId, userId)))
    .limit(1);
  if (deck.length === 0) {
    throw new Error("Unauthorized");
  }

  const validated = updateCardSchema.parse(data);

  const result = await db
    .update(cards)
    .set({ ...validated, updatedAt: new Date() })
    .where(eq(cards.id, id))
    .returning();

  revalidatePath("/dashboard");

  return result[0];
}

export async function deleteCard(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingCard = await db
    .select()
    .from(cards)
    .where(eq(cards.id, id))
    .limit(1);
  if (existingCard.length === 0) {
    throw new Error("Card not found");
  }

  const deck = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, existingCard[0].deckId), eq(decks.userId, userId)))
    .limit(1);
  if (deck.length === 0) {
    throw new Error("Unauthorized");
  }

  await db.delete(cards).where(eq(cards.id, id)).returning();

  revalidatePath("/dashboard");

  return { success: true };
}