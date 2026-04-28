"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DeckCardsClient } from "@/components/DeckCardsClient";
import { StudyStartDialog } from "@/components/StudyStartDialog";
import { DeckDialog } from "@/components/DeckDialog";
import { DeleteDeckButton } from "@/components/DeleteDeckButton";
import type { Deck, Card as CardType } from "@/db/schema";

interface DeckPageClientProps {
  deck: Deck;
  cards: CardType[];
  deckId: string;
}

export function DeckPageClient({ deck, cards, deckId }: DeckPageClientProps) {
  const router = useRouter();
  const [studyDialogOpen, setStudyDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDeckUpdated = () => {
    router.refresh();
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{deck.name}</CardTitle>
              {deck.description && (
                <CardDescription className="mt-2">
                  {deck.description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <DeleteDeckButton
                deckId={deck.id}
                deckName={deck.name}
                cardCount={cards.length}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-4">
            {deck.category && (
              <span className="text-sm bg-muted px-2 py-1 rounded">
                {deck.category}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {cards.length} cards
            </span>
            <span className="text-sm text-muted-foreground">
              Updated {deck.updatedAt.toLocaleDateString("en-AU")}
            </span>
          </div>
          {cards.length > 0 && (
            <Button
              className="w-full"
              onClick={() => setStudyDialogOpen(true)}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Study
            </Button>
          )}
        </CardContent>
      </Card>

      <DeckCardsClient
        cards={cards}
        deckId={deckId}
      />

      <StudyStartDialog
        deckId={deckId}
        cardCount={cards.length}
        open={studyDialogOpen}
        onOpenChange={setStudyDialogOpen}
      />

      <DeckDialog
        mode="edit"
        deck={{
          id: deck.id,
          name: deck.name,
          description: deck.description,
          category: deck.category,
          isPublic: deck.isPublic,
        }}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleDeckUpdated}
      />
    </>
  );
}