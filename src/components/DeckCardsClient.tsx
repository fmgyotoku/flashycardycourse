"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddCardModal } from "@/components/AddCardModal";
import { EditCardModal } from "@/components/EditCardModal";
import { DeleteCardButton } from "@/components/DeleteCardButton";
import type { Card as CardType } from "@/db/schema";

interface DeckCardsClientProps {
  cards: CardType[];
  deckId: string;
}

export function DeckCardsClient({ cards, deckId }: DeckCardsClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCard, setEditCard] = useState<CardType | null>(null);

  const sortedCards = [...cards].sort((a, b) => a.front.localeCompare(b.front));

  const handleCardAdded = () => {
    router.refresh();
    setModalOpen(false);
  };

  const handleCardUpdated = () => {
    router.refresh();
    setEditCard(null);
  };

  const handleCardDeleted = () => {
    router.refresh();
  };

  const openEditModal = (card: CardType) => {
    setEditCard(card);
  };

  const handleEditModalClose = (open: boolean) => {
    if (!open) {
      setEditCard(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
          + Add Card
        </Button>
      </div>

      {sortedCards.length === 0 ? (
        <p className="text-muted-foreground">No cards in this deck yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedCards.map((card) => (
            <Card
              key={card.id}
              className="hover:border-zinc-400 transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Front</CardTitle>
<div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditModal(card)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteCardButton
                        cardId={card.id}
                        onDeleted={handleCardDeleted}
                      />
                    </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{card.front}</p>
              </CardContent>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Back</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{card.back}</p>
              </CardContent>
              {card.hint && (
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Hint: {card.hint}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <AddCardModal
        deckId={parseInt(deckId, 10)}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCardAdded={handleCardAdded}
      />

      <EditCardModal
        card={editCard}
        open={!!editCard}
        onOpenChange={handleEditModalClose}
        onCardUpdated={handleCardUpdated}
      />
    </>
  );
}