import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { UserMenu } from "@/components/auth/UserMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Compass",
  description: "College discovery, comparison, and rank prediction platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <header className="sticky top-0 z-30 border-b border-black/10 bg-mist/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold text-ink">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-moss text-white">
                  <GraduationCap size={20} />
                </span>
                <span className="hidden sm:inline">College Compass</span>
              </Link>
              <nav className="flex items-center gap-1 text-sm font-medium text-ink/70">
                <Link className="rounded-md px-2 py-2 hover:bg-white sm:px-3" href="/">
                  Discover
                </Link>
                <Link className="rounded-md px-2 py-2 hover:bg-white sm:px-3" href="/compare">
                  Compare
                </Link>
                <Link className="rounded-md px-2 py-2 hover:bg-white sm:px-3" href="/predictor">
                  Predictor
                </Link>
              </nav>
              <UserMenu />
            </div>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
