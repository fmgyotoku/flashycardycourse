"use client";

import { DeckDialog } from "./DeckDialog";

interface CreateDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeckCreated: () => void;
}

export function CreateDeckDialog({
  open,
  onOpenChange,
  onDeckCreated,
}: CreateDeckDialogProps) {
  return (
    <DeckDialog
      mode="create"
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onDeckCreated}
    />
  );
}