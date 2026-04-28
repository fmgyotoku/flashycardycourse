"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDeck } from "@/app/actions/deck";
import { showErrorToast } from "@/lib/errorHandler";
import { toast } from "sonner";

interface DeckData {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  isPublic: boolean;
}

interface DeckDialogProps {
  mode: "create" | "edit";
  deck?: DeckData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeckDialog({
  mode,
  deck,
  open,
  onOpenChange,
  onSuccess,
}: DeckDialogProps) {
  const router = useRouter();
  
  // Initialize state - will be set when dialog opens
  const [name, setName] = useState(mode === "edit" && deck ? deck.name : "");
  const [description, setDescription] = useState(mode === "edit" && deck ? (deck.description || "") : "");
  const [category, setCategory] = useState(mode === "edit" && deck ? (deck.category || "") : "");
  const [isPublic, setIsPublic] = useState(mode === "edit" && deck ? deck.isPublic : false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newDeckId, setNewDeckId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const createdDeck = await createDeck({
          name,
          description: description || undefined,
          category: category || undefined,
          isPublic,
        });
        toast.success("Deck created successfully");
        setNewDeckId(createdDeck.id);
        setShowSuccessDialog(true);
      } else if (mode === "edit" && deck) {
        const { updateDeck } = await import("@/app/actions/deck");
        await updateDeck(deck.id, {
          name,
          description: description || undefined,
          category: category || undefined,
          isPublic,
        });
        toast.success("Deck updated successfully");
        handleClose();
        onSuccess?.();
      }
    } catch (err) {
      showErrorToast(err, `Failed to ${mode === "create" ? "create" : "update"} deck`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (mode === "create") {
      setName("");
      setDescription("");
      setCategory("");
      setIsPublic(false);
    }
    onOpenChange(false);
  };

  const handleAddCards = () => {
    setShowSuccessDialog(false);
    if (newDeckId) {
      router.push(`/decks/${newDeckId}`);
    }
    handleClose();
    onSuccess?.();
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    setName("");
    setDescription("");
    setCategory("");
    setIsPublic(false);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create New Deck" : "Edit Deck"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Enter the details for your new deck. Name is required."
                : "Update the deck details. Name is required."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Deck name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Optional category"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isPublic" className="font-normal">
                  Make deck public
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : mode === "create"
                  ? "Create Deck"
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {mode === "create" && (
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deck Created!</DialogTitle>
              <DialogDescription>
                Your new deck has been created successfully.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseSuccess}>
                Stay Here
              </Button>
              <Button onClick={handleAddCards}>Add Cards</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}