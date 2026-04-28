import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getDeckWithUserId } from "@/db/Deck";
import { getCardsByDeckId } from "@/db/Card";
import { DeckPageClient } from "@/components/DeckPageClient";

interface DeckPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { deckId } = await params;
  const deckNumId = parseInt(deckId, 10);

  if (isNaN(deckNumId)) {
    notFound();
  }

  const deck = await getDeckWithUserId(deckNumId);

  if (!deck || deck.userId !== userId) {
    notFound();
  }

  const cards = await getCardsByDeckId(deckNumId);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <DeckPageClient deck={deck} cards={cards} deckId={deckId} />
    </div>
  );
}