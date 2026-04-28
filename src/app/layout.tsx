import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { dark } from "@clerk/ui/themes";
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Flashy Cardy",
  description: "Flashy Cardy - Your Flashcard App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
        appearance={{ theme: dark }}
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
      <html lang="en" className={`${merriweather.variable} dark h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <header className="flex items-center justify-between gap-4 p-4">
            <span className="font-bold text-lg">Flashy Cardy</span>
            <div className="flex gap-4">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="secondary">Sign Up</Button>
                </SignUpButton>
              </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
            </div>
          </header>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}