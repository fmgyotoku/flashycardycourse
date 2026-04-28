"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CreateDeckDialog } from "@/components/CreateDeckDialog";

interface DeckWithCardCount {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  cardCount: number;
  updatedAt: Date;
}

interface DashboardClientProps {
  decks: DeckWithCardCount[];
}

export function DashboardClient({ decks }: DashboardClientProps) {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleDeckCreated = () => {
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>+ Create New Deck</Button>
      </div>
      {decks.length === 0 ? (
        <p className="text-zinc-400">You haven&apos;t created any decks yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Link key={deck.id} href={`/decks/${deck.id}`}>
              <Card className="hover:border-zinc-400 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{deck.name}</CardTitle>
                  {deck.description && (
                    <CardDescription>{deck.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {deck.category && (
                      <span className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                        {deck.category}
                      </span>
                    )}
                    <span className="text-sm text-zinc-400">
                      {deck.cardCount} cards
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Updated {deck.updatedAt.toLocaleDateString('en-AU')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateDeckDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onDeckCreated={handleDeckCreated}
      />
    </>
  );
}