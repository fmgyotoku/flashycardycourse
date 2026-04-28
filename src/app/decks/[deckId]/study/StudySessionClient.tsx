"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudyCard {
  id: number;
  front: string;
  back: string;
  hint: string | null;
}

interface StudySessionProps {
  deckId: number;
  deckName: string;
  cards: StudyCard[];
}

export default function StudySession({ deckId, deckName, cards }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{deckName}</h1>
        <p className="text-muted-foreground mb-4">
          No cards in this deck to study.
        </p>
        <Link href={`/decks/${deckId}`}>
          <Button>Back to Deck</Button>
        </Link>
      </div>
    );
  }

  if (isComplete) {
    const total = correctCount + incorrectCount;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Study Complete!</h1>
        <p className="text-muted-foreground mb-8">{deckName}</p>

        <Card className="max-w-md mx-auto mb-8">
          <CardContent className="pt-6">
            <p className="text-5xl font-bold mb-2">{percentage}%</p>
            <p className="text-muted-foreground">
              {correctCount} correct, {incorrectCount} incorrect
            </p>
          </CardContent>
        </Card>

        <Link href={`/decks/${deckId}`}>
          <Button>Back to Deck</Button>
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsComplete(true);
    }
  };

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

      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full mt-2">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <Card
        className="max-w-2xl mx-auto cursor-pointer min-h-[300px]"
        onClick={handleFlip}
      >
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {isFlipped ? "Answer" : "Question"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-grow">
          <p className="text-lg text-center">{isFlipped ? currentCard.back : currentCard.front}</p>
        </CardContent>
        {isFlipped && currentCard.hint && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground text-center">
              Hint: {currentCard.hint}
            </p>
          </CardContent>
        )}
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Click card to flip
      </p>

      {isFlipped && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="destructive"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handleAnswer(false);
            }}
          >
            Incorrect
          </Button>
          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handleAnswer(true);
            }}
          >
            Correct
          </Button>
        </div>
      )}
    </div>
  );
}