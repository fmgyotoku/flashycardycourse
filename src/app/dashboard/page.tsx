import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDecksByUserId } from "@/db/Deck";
import { DashboardClient } from "@/components/DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userDecks = await getDecksByUserId(userId);

  return (
    <div className="container mx-auto p-8">
      <DashboardClient decks={userDecks} />
    </div>
  );
}