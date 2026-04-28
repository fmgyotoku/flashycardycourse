"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCard } from "@/app/actions/card";
import { showErrorToast } from "@/lib/errorHandler";

interface AddCardModalProps {
  deckId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCardAdded: () => void;
}

export function AddCardModal({
  deckId,
  open,
  onOpenChange,
  onCardAdded,
}: AddCardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [hint, setHint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCard({
        deckId,
        front,
        back,
        hint: hint || undefined,
        order: 0,
      });
      setFront("");
      setBack("");
      setHint("");
      onCardAdded();
    } catch (err) {
      showErrorToast(err, "Failed to create card");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFront("");
    setBack("");
    setHint("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Create a new flashcard for this deck. Front and Back are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">Front *</Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Question or prompt"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="back">Back *</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Answer"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hint">Hint (optional)</Label>
              <Input
                id="hint"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Optional hint"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}