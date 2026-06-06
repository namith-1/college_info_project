"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Settings, UserCircle } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="h-9 w-20 rounded-md bg-white/70" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/signin" className="rounded-md px-3 py-2 text-sm font-semibold text-ink/70 hover:bg-white">
          Sign in
        </Link>
        <Link href="/signup" className="rounded-md bg-moss px-3 py-2 text-sm font-semibold text-white">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/saved" className="rounded-md px-3 py-2 text-sm font-semibold text-ink/70 hover:bg-white">
        Saved
      </Link>
      <Link href="/settings" className="rounded-md p-2 text-ink/60 hover:bg-white" aria-label="Settings">
        <Settings size={17} />
      </Link>
      <span className="hidden max-w-32 items-center gap-1 truncate text-sm font-semibold text-ink/70 sm:flex">
        <UserCircle size={17} />
        {session.user.name || session.user.email}
      </span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-md p-2 text-ink/60 hover:bg-white"
        aria-label="Sign out"
      >
        <LogOut size={17} />
      </button>
    </div>
  );
}
