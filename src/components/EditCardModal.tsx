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
import { updateCard } from "@/app/actions/card";
import { showErrorToast } from "@/lib/errorHandler";

interface CardData {
  id: number;
  front: string;
  back: string;
  hint: string | null;
}

interface EditCardModalProps {
  card: CardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCardUpdated: () => void;
}

export function EditCardModal({
  card,
  open,
  onOpenChange,
  onCardUpdated,
}: EditCardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [hint, setHint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (open && card) {
    if (front === "" && back === "" && hint === "") {
      setFront(card.front);
      setBack(card.back);
      setHint(card.hint || "");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!card) {
        throw new Error("No card selected");
      }
      await updateCard(card.id, {
        front,
        back,
        hint: hint || undefined,
      });
      onCardUpdated();
    } catch (err) {
      showErrorToast(err, "Failed to update card");
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
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>
            Update the card details. Front and Back are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-front">Front *</Label>
              <Textarea
                id="edit-front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Question or prompt"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-back">Back *</Label>
              <Textarea
                id="edit-back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Answer"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-hint">Hint (optional)</Label>
              <Input
                id="edit-hint"
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}