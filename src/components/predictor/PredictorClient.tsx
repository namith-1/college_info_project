"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import type { College, Filters } from "@/types";
import { fetchJson } from "@/lib/api";
import { formatFees } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";

type Prediction = {
  college: College;
  courseName: string;
  minRank: number;
  maxRank: number;
  confidence: "Likely" | "Reach" | "Ambitious";
  reason: string;
};

export function PredictorClient() {
  const [facets, setFacets] = useState<Filters>({ cities: [], states: [], courses: [], exams: [] });
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [course, setCourse] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Prediction[] | null>(null);

  useEffect(() => {
    fetchJson<Filters>("/api/filters").then((data) => {
      setFacets(data);
      setExam(data.exams[0]?.code ?? "");
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetchJson<{ data: Prediction[] }>("/api/predictor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exam, rank, course: course || undefined, state: state || undefined })
    });
    setResults(response.data);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="h-fit rounded-lg border border-black/10 bg-white p-5 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-moss text-white"><Target size={20} /></span>
          <div>
            <h2 className="font-bold text-ink">Rank inputs</h2>
            <p className="text-sm text-ink/55">Match against previous cutoff bands.</p>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Exam">
            <select className="input" value={exam} onChange={(event) => setExam(event.target.value)} required>
              {facets.exams.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select>
          </Field>
          <Field label="Rank">
            <input className="input" inputMode="numeric" value={rank} onChange={(event) => setRank(event.target.value)} placeholder="Example: 18000" required />
          </Field>
          <Field label="Preferred course">
            <select className="input" value={course} onChange={(event) => setCourse(event.target.value)}>
              <option value="">Any course</option>
              {facets.courses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Preferred state">
            <select className="input" value={state} onChange={(event) => setState(event.target.value)}>
              <option value="">Any state</option>
              {facets.states.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
        </div>
        <button disabled={loading} className="mt-5 w-full rounded-md bg-coral px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
          {loading ? "Finding matches" : "Predict colleges"}
        </button>
      </form>

      <section>
        {!results ? (
          <EmptyState title="Enter your rank to begin" body="Recommendations will appear here with match confidence and cutoff reasoning." />
        ) : results.length ? (
          <div className="space-y-4">
            {results.map((prediction) => (
              <article key={`${prediction.college.id}-${prediction.courseName}`} className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${badgeClass(prediction.confidence)}`}>{prediction.confidence}</span>
                    <h3 className="mt-3 text-xl font-bold text-ink">{prediction.college.name}</h3>
                    <p className="mt-1 text-sm text-ink/55">{prediction.college.city}, {prediction.college.state}</p>
                  </div>
                  <Link href={`/colleges/${prediction.college.slug}`} className="inline-flex items-center gap-1 rounded-md bg-moss px-3 py-2 text-sm font-semibold text-white">
                    View details <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Info label="Matched course" value={prediction.courseName} />
                  <Info label="Cutoff range" value={`${prediction.minRank.toLocaleString("en-IN")} - ${prediction.maxRank.toLocaleString("en-IN")}`} />
                  <Info label="Fees" value={formatFees(prediction.college.feesMin, prediction.college.feesMax)} />
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/65">{prediction.reason}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No rank matches found" body="Try a broader course or state preference, or check a different exam." />
        )}
      </section>
    </div>
  );
}

function badgeClass(confidence: Prediction["confidence"]) {
  if (confidence === "Likely") return "bg-moss/12 text-moss";
  if (confidence === "Reach") return "bg-gold/15 text-ink";
  return "bg-coral/12 text-coral";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink/70">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-mist p-3">
      <div className="text-xs font-semibold uppercase text-ink/45">{label}</div>
      <div className="mt-1 text-sm font-bold text-ink">{value}</div>
    </div>
  );
}
