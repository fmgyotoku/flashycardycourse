"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { startStudySession } from "@/app/actions/study";

interface StudyStartDialogProps {
  deckId: string;
  cardCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudyStartDialog({
  deckId,
  cardCount,
  open,
  onOpenChange,
}: StudyStartDialogProps) {
  const [count, setCount] = useState(cardCount);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setCount(cardCount);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Study Session</DialogTitle>
          <DialogDescription>
            This deck has {cardCount} {cardCount === 1 ? "card" : "cards"}.
            Select how many cards to study.
          </DialogDescription>
        </DialogHeader>
        <form action={startStudySession}>
          <input type="hidden" name="deckId" value={deckId} />
          <div className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="count">Number of cards</Label>
              <Input
                id="count"
                name="count"
                type="number"
                min={1}
                max={cardCount}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Start</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}