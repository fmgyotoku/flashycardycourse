import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-center">FlashyCardy</h1>
      <p className="mt-4 text-xl text-zinc-400">Your personal flashcard platform</p>
      <div className="mt-8 flex gap-4">
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="secondary">Sign Up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}