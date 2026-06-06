"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { useSession } from "next-auth/react";
import type { College, Filters } from "@/types";
import { fetchJson } from "@/lib/api";
import { CollegeCard } from "./CollegeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";

type ListingResponse = {
  data: College[];
  meta: { total: number; page: number; limit: number; pageCount: number };
};

const initialFilters = {
  q: "",
  state: "",
  city: "",
  course: "",
  exam: "",
  maxFees: "",
  minRating: "",
  sort: "relevance"
};

export function CollegeExplorer() {
  const [filters, setFilters] = useState(initialFilters);
  const [facets, setFacets] = useState<Filters>({ cities: [], states: [], courses: [], exams: [] });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<College[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ListingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchJson<Filters>("/api/filters").then(setFacets).catch(() => setFacets({ cities: [], states: [], courses: [], exams: [] }));
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setSavedIds(new Set());
      return;
    }
    fetchJson<{ data: College[] }>("/api/saved/colleges")
      .then((response) => setSavedIds(new Set(response.data.map((college) => college.id))))
      .catch(() => setSavedIds(new Set()));
  }, [session?.user]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("page", String(page));
    params.set("limit", "8");
    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    setLoading(true);
    fetchJson<ListingResponse>(`/api/colleges?${query}`)
      .then(setResult)
      .finally(() => setLoading(false));
  }, [query]);

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function toggleCompare(college: College) {
    setSelected((current) => {
      if (current.some((item) => item.id === college.id)) {
        return current.filter((item) => item.id !== college.id);
      }
      return [...current, college].slice(0, 3);
    });
  }

  async function toggleSave(college: College, nextSaved: boolean) {
    setSavedIds((current) => {
      const copy = new Set(current);
      if (nextSaved) copy.add(college.id);
      else copy.delete(college.id);
      return copy;
    });

    const response = await fetch("/api/saved/colleges", {
      method: nextSaved ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId: college.id })
    });

    if (!response.ok) {
      setSavedIds((current) => {
        const copy = new Set(current);
        if (nextSaved) copy.delete(college.id);
        else copy.add(college.id);
        return copy;
      });
    }
  }

  const compareHref = selected.length ? `/compare?ids=${selected.map((college) => college.id).join(",")}` : "/compare";

  return (
    <main>
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-coral">College discovery</p>
            <h1 className="mt-2 text-3xl font-bold text-ink sm:text-5xl">Find the right college with search, filters, and rank-fit signals.</h1>
            <p className="mt-4 text-base leading-7 text-ink/65">
              Explore verified database-backed listings, compare tradeoffs, and shortlist colleges by fees, placements, location, and accepted exams.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[290px_1fr]">
        <aside className="h-fit rounded-lg border border-black/10 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
              <SlidersHorizontal size={18} /> Filters
            </h2>
            <button className="text-sm font-medium text-coral" type="button" onClick={() => setFilters(initialFilters)}>
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <Field label="Search">
              <input className="input" value={filters.q} onChange={(event) => updateFilter("q", event.target.value)} placeholder="College, city, course" />
            </Field>
            <Field label="State">
              <select className="input" value={filters.state} onChange={(event) => updateFilter("state", event.target.value)}>
                <option value="">Any state</option>
                {facets.states.map((state) => <option key={state}>{state}</option>)}
              </select>
            </Field>
            <Field label="City">
              <select className="input" value={filters.city} onChange={(event) => updateFilter("city", event.target.value)}>
                <option value="">Any city</option>
                {facets.cities.map((city) => <option key={city}>{city}</option>)}
              </select>
            </Field>
            <Field label="Course">
              <select className="input" value={filters.course} onChange={(event) => updateFilter("course", event.target.value)}>
                <option value="">Any course</option>
                {facets.courses.map((course) => <option key={course}>{course}</option>)}
              </select>
            </Field>
            <Field label="Exam">
              <select className="input" value={filters.exam} onChange={(event) => updateFilter("exam", event.target.value)}>
                <option value="">Any exam</option>
                {facets.exams.map((exam) => <option key={exam.code} value={exam.code}>{exam.name}</option>)}
              </select>
            </Field>
            <Field label="Max fees">
              <select className="input" value={filters.maxFees} onChange={(event) => updateFilter("maxFees", event.target.value)}>
                <option value="">Any budget</option>
                <option value="300000">Under Rs 3 L</option>
                <option value="800000">Under Rs 8 L</option>
                <option value="1500000">Under Rs 15 L</option>
                <option value="3500000">Under Rs 35 L</option>
              </select>
            </Field>
            <Field label="Minimum rating">
              <select className="input" value={filters.minRating} onChange={(event) => updateFilter("minRating", event.target.value)}>
                <option value="">Any rating</option>
                <option value="4">4.0+</option>
                <option value="4.3">4.3+</option>
                <option value="4.6">4.6+</option>
              </select>
            </Field>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink/60">{result ? `${result.meta.total} colleges found` : "Searching colleges"}</p>
              {selected.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.map((college) => (
                    <button key={college.id} onClick={() => toggleCompare(college)} className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
                      {college.name} <X size={13} />
                    </button>
                  ))}
                  <Link href={compareHref} className="rounded-md bg-coral px-3 py-1 text-xs font-semibold text-white">
                    Compare now
                  </Link>
                </div>
              )}
            </div>
            <select className="input w-52" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
              <option value="relevance">Sort by relevance</option>
              <option value="rating">Highest rated</option>
              <option value="fees_asc">Fees low to high</option>
              <option value="fees_desc">Fees high to low</option>
              <option value="package">Best average package</option>
            </select>
          </div>

          {loading ? (
            <LoadingState label="Loading colleges" />
          ) : result?.data.length ? (
            <div className="space-y-4">
              {result.data.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  selected={selected.some((item) => item.id === college.id)}
                  saved={savedIds.has(college.id)}
                  onCompare={toggleCompare}
                  onSave={toggleSave}
                />
              ))}
              <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3">
                <button className="rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                  <ArrowLeft className="inline" size={16} /> Previous
                </button>
                <span className="text-sm font-medium text-ink/60">
                  Page {result.meta.page} of {Math.max(1, result.meta.pageCount)}
                </span>
                <button className="rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page >= result.meta.pageCount} onClick={() => setPage((value) => value + 1)}>
                  Next <ArrowRight className="inline" size={16} />
                </button>
              </div>
            </div>
          ) : (
            <EmptyState title="No colleges found" body="Try broadening the location, fees, or course filters." />
          )}
        </div>
      </section>
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid rgba(0, 0, 0, 0.14);
          background: white;
          padding: 0.65rem 0.75rem;
          color: #17201d;
          outline: none;
        }
        .input:focus {
          border-color: #315b48;
          box-shadow: 0 0 0 3px rgba(49, 91, 72, 0.16);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink/70">{label}</span>
      {children}
    </label>
  );
}
