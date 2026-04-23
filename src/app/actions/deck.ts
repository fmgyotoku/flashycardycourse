"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { decks } from "@/db/schema";
import { getDecksByUserId } from "@/db/Deck";
import { createDeckSchema, updateDeckSchema } from "@/lib/schemas";
import type { CreateDeckInput, UpdateDeckInput } from "@/lib/schemas";
import { eq } from "drizzle-orm";

export async function createDeck(data: CreateDeckInput) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validated = createDeckSchema.parse(data);

  const result = await db.insert(decks).values({ ...validated, userId }).returning();

  revalidatePath("/dashboard");

  return result[0];
}

export async function updateDeck(id: number, data: UpdateDeckInput) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await getDecksByUserId(userId);
  const deck = existing.find((d) => d.id === id);
  if (!deck) {
    throw new Error("Deck not found");
  }

  const validated = updateDeckSchema.parse(data);

  const result = await db
    .update(decks)
    .set({ ...validated, updatedAt: new Date() })
    .where(eq(decks.id, id))
    .returning();

  revalidatePath("/dashboard");

  return result[0];
}

export async function deleteDeck(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await getDecksByUserId(userId);
  const deck = existing.find((d) => d.id === id);
  if (!deck) {
    throw new Error("Deck not found");
  }

  await db.delete(decks).where(eq(decks.id, id)).returning();

  revalidatePath("/dashboard");

  return { success: true };
}