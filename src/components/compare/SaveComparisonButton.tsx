"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkPlus } from "lucide-react";
import { useSession } from "next-auth/react";

export function SaveComparisonButton({ collegeIds }: { collegeIds: string[] }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (collegeIds.length < 2) return null;

  if (!session?.user) {
    return (
      <Link href="/signin" className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-mist">
        <BookmarkPlus size={16} /> Sign in to save
      </Link>
    );
  }

  async function save() {
    setLoading(true);
    const response = await fetch("/api/saved/comparisons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeIds })
    });
    if (response.ok) setSaved(true);
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={save}
      disabled={loading || saved}
      className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-mist disabled:opacity-60"
    >
      <BookmarkPlus size={16} />
      {saved ? "Comparison saved" : loading ? "Saving" : "Save comparison"}
    </button>
  );
}
