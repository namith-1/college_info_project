"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import type { College } from "@/types";
import { fetchJson } from "@/lib/api";
import { formatFees } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";

type SavedComparison = {
  id: string;
  name: string;
  collegeIds: string[];
  colleges: College[];
};

export function SavedDashboard() {
  const { data: session, status } = useSession();
  const [colleges, setColleges] = useState<College[]>([]);
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetchJson<{ data: College[] }>("/api/saved/colleges"),
      fetchJson<{ data: SavedComparison[] }>("/api/saved/comparisons")
    ])
      .then(([collegeResponse, comparisonResponse]) => {
        setColleges(collegeResponse.data);
        setComparisons(comparisonResponse.data);
      })
      .finally(() => setLoading(false));
  }, [session?.user, status]);

  async function removeCollege(collegeId: string) {
    const response = await fetch("/api/saved/colleges", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId })
    });
    if (response.ok) setColleges((current) => current.filter((college) => college.id !== collegeId));
  }

  async function removeComparison(id: string) {
    const response = await fetch(`/api/saved/comparisons/${id}`, { method: "DELETE" });
    if (response.ok) setComparisons((current) => current.filter((comparison) => comparison.id !== id));
  }

  if (loading) return <LoadingState label="Loading saved items" />;

  if (!session?.user) {
    return <EmptyState title="Sign in to see saved items" body="Your saved colleges and comparison sets will appear here after you sign in." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Saved Colleges</h2>
          <span className="text-sm font-semibold text-ink/50">{colleges.length} saved</span>
        </div>
        {colleges.length ? (
          <div className="grid gap-4">
            {colleges.map((college) => (
              <article key={college.id} className="rounded-lg border border-black/10 bg-white p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link href={`/colleges/${college.slug}`} className="text-lg font-bold text-ink hover:text-moss">
                      {college.name}
                    </Link>
                    <p className="mt-1 text-sm text-ink/55">{college.city}, {college.state}</p>
                    <p className="mt-2 text-sm font-semibold text-ink/70">{formatFees(college.feesMin, college.feesMax)} · {college.rating.toFixed(1)} rating</p>
                  </div>
                  <button onClick={() => removeCollege(college.id)} className="rounded-md p-2 text-ink/50 hover:bg-mist" aria-label="Remove saved college">
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No saved colleges yet" body="Use the Save action on college cards or detail pages to build your shortlist." />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Saved Comparisons</h2>
          <span className="text-sm font-semibold text-ink/50">{comparisons.length} saved</span>
        </div>
        {comparisons.length ? (
          <div className="grid gap-4">
            {comparisons.map((comparison) => (
              <article key={comparison.id} className="rounded-lg border border-black/10 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{comparison.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/58">
                      {comparison.colleges.map((college) => college.name).join(" vs ")}
                    </p>
                  </div>
                  <button onClick={() => removeComparison(comparison.id)} className="rounded-md p-2 text-ink/50 hover:bg-mist" aria-label="Delete comparison">
                    <Trash2 size={17} />
                  </button>
                </div>
                <Link href={`/compare?ids=${comparison.collegeIds.join(",")}`} className="mt-4 inline-block rounded-md bg-moss px-3 py-2 text-sm font-semibold text-white">
                  Open comparison
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No saved comparisons" body="Compare two or three colleges, then save the decision set here." />
        )}
      </section>
    </div>
  );
}
