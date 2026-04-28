"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FinishSessionDialog } from "@/components/FinishSessionDialog";
import type { Card as CardType } from "@/db/schema";

interface StudySessionClientProps {
  deckId: string;
  deckName: string;
  cards: CardType[];
  studyCount: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function StudySessionClient({
  deckId,
  deckName,
  cards,
  studyCount,
}: StudySessionClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  const studyCards = useMemo(() => {
    return shuffleArray(cards).slice(0, studyCount);
  }, [cards, studyCount]);

  const currentCard = studyCards[currentIndex];
  const isLastCard = currentIndex === studyCards.length - 1;

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }

    if (isLastCard) {
      setShowFinishDialog(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handleFinish = () => {
    setShowFinishDialog(true);
  };

  const handleFinishDialogClose = () => {
    router.push(`/decks/${deckId}`);
  };

  if (!currentCard) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">No cards to study.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{deckName}</h1>
        <Button variant="outline" onClick={handleFinish}>
          Finish Session
        </Button>
      </div>

      <div className="flex justify-center mb-4">
        <span className="text-muted-foreground">
          Card {currentIndex + 1} of {studyCards.length}
        </span>
      </div>

      <div className="flex justify-center mb-8">
        <div
          key={currentIndex}
          className="relative w-full max-w-md h-64 perspective-1000 cursor-pointer"
          onClick={handleFlip}
        >
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transformOrigin: "center",
            }}
          >
            <div
              className="absolute inset-0 backface-hidden rounded-lg border bg-card p-6 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <h2 className="text-lg font-semibold mb-4">Front</h2>
              <p className="text-center">{currentCard.front}</p>
              <p className="text-sm text-muted-foreground mt-4">
                (Click to flip)
              </p>
            </div>
            <div
              className="absolute inset-0 backface-hidden rounded-lg border bg-card p-6 flex flex-col items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <h2 className="text-lg font-semibold mb-4">Back</h2>
              <p className="text-center">{currentCard.back}</p>
              {currentCard.hint && (
                <p className="text-sm text-muted-foreground mt-4">
                  Hint: {currentCard.hint}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="flex justify-center gap-4">
          <Button
            variant="destructive"
            onClick={() => handleAnswer(false)}
          >
            Incorrect
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleAnswer(true)}
          >
            Correct
          </Button>
        </div>
      )}

      <FinishSessionDialog
        open={showFinishDialog}
        onOpenChange={setShowFinishDialog}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        totalCards={studyCards.length}
        onClose={handleFinishDialogClose}
      />
    </div>
  );
}