import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getDeckWithUserId } from "@/db/Deck";
import { getCardsByDeckId } from "@/db/Card";
import { StudySessionClient } from "@/components/StudySessionClient";

interface StudyPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
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

  if (cards.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <div className="mb-6">
          <Link
            href={`/decks/${deckId}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Deck
          </Link>
        </div>
        <p className="text-muted-foreground">
          No cards in this deck yet. Add some cards first to start studying.
        </p>
      </div>
    );
  }

  const cookieStore = await cookies();
  const studyCountCookie = cookieStore.get(`study-session-${deckId}`);
  const studyCount = studyCountCookie
    ? parseInt(studyCountCookie.value, 10)
    : cards.length;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link
          href={`/decks/${deckId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Deck
        </Link>
      </div>

      <StudySessionClient
        deckId={deckId}
        deckName={deck.name}
        cards={cards}
        studyCount={Math.min(studyCount, cards.length)}
      />
    </div>
  );
}