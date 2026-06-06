"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";

export function SaveCollegeButton({
  collegeId,
  initialSaved = false,
  compact = false
}: {
  collegeId: string;
  initialSaved?: boolean;
  compact?: boolean;
}) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className={`inline-flex items-center justify-center gap-2 rounded-md border border-black/15 bg-white font-semibold text-ink hover:bg-mist ${
          compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm"
        }`}
      >
        <Bookmark size={16} /> Save
      </Link>
    );
  }

  async function toggle() {
    setLoading(true);
    const nextSaved = !saved;
    const response = await fetch("/api/saved/colleges", {
      method: nextSaved ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId })
    });
    if (response.ok) setSaved(nextSaved);
    setLoading(false);
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggle}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold disabled:opacity-60 ${
        saved ? "bg-gold text-ink" : "border border-black/15 bg-white text-ink hover:bg-mist"
      } ${compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm"}`}
    >
      <Bookmark size={16} className={saved ? "fill-ink" : ""} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
