"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FinishSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correctCount: number;
  incorrectCount: number;
  totalCards: number;
  onClose: () => void;
}

export function FinishSessionDialog({
  open,
  onOpenChange,
  correctCount,
  incorrectCount,
  totalCards,
  onClose,
}: FinishSessionDialogProps) {
  const handleClose = () => {
    onClose();
    onOpenChange(false);
  };

  const percentage = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Complete!</DialogTitle>
          <DialogDescription>
            You have completed the study session. Here are your results:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {correctCount}
              </p>
              <p className="text-sm">Correct</p>
            </div>
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {incorrectCount}
              </p>
              <p className="text-sm">Incorrect</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">{percentage}% correct</p>
            <p className="text-sm text-muted-foreground">
              {correctCount} out of {totalCards} cards
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}