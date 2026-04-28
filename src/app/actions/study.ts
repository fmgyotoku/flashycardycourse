"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function startStudySession(formData: FormData) {
  const deckId = formData.get("deckId") as string;
  const count = parseInt(formData.get("count") as string, 10);

  const cookieStore = await cookies();
  cookieStore.set(`study-session-${deckId}`, count.toString(), {
    httpOnly: true,
    path: `/decks/${deckId}/study`,
    maxAge: 60 * 60, // 1 hour - persists until session complete
  });

  redirect(`/decks/${deckId}/study`);
}