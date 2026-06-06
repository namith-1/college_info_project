"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { College } from "@/types";
import { fetchJson } from "@/lib/api";
import { formatFees } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";

export function CompareClient({ ids }: { ids: string[] }) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(Boolean(ids.length));

  const query = useMemo(() => ids.slice(0, 3).join(","), [ids]);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetchJson<{ data: College[] }>(`/api/compare?ids=${query}`)
      .then((response) => setColleges(response.data))
      .finally(() => setLoading(false));
  }, [query]);

  function remove(id: string) {
    const next = colleges.filter((college) => college.id !== id).map((college) => college.id).join(",");
    window.location.href = next ? `/compare?ids=${next}` : "/compare";
  }

  if (!ids.length) {
    return <EmptyState title="Choose colleges to compare" body="Use the Discover page to add two or three colleges, then return here for a side-by-side view." />;
  }

  if (loading) return <LoadingState label="Loading comparison" />;

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-soft">
      <table className="w-full min-w-[760px] table-fixed text-left">
        <thead>
          <tr>
            <th className="w-48 bg-mist p-4 text-sm font-semibold text-ink/60">Criteria</th>
            {colleges.map((college) => (
              <th key={college.id} className="border-l border-black/10 p-4 align-top">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/colleges/${college.slug}`} className="text-lg font-bold text-ink hover:text-moss">
                      {college.name}
                    </Link>
                    <p className="mt-1 text-sm text-ink/55">{college.city}, {college.state}</p>
                  </div>
                  <button onClick={() => remove(college.id)} className="rounded-md p-1.5 text-ink/55 hover:bg-mist" aria-label="Remove college">
                    <X size={17} />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          <Row label="Rating" values={colleges.map((college) => `${college.rating.toFixed(1)} / 5 (${college.reviewCount} reviews)`)} />
          <Row label="Fees" values={colleges.map((college) => formatFees(college.feesMin, college.feesMax))} />
          <Row label="Location" values={colleges.map((college) => `${college.city}, ${college.state}`)} />
          <Row label="Average package" values={colleges.map((college) => `${college.placement?.averagePackage ?? "-"} LPA`)} />
          <Row label="Highest package" values={colleges.map((college) => `${college.placement?.highestPackage ?? "-"} LPA`)} />
          <Row label="Placement rate" values={colleges.map((college) => `${college.placement?.placementRate ?? "-"}%`)} />
          <Row label="Courses" values={colleges.map((college) => college.courses.map((course) => `${course.degree} ${course.name}`).join(", "))} />
          <Row label="Accepted exams" values={colleges.map((college) => college.cutoffs?.map((cutoff) => cutoff.exam.name).filter((value, index, list) => list.indexOf(value) === index).join(", ") || "-")} />
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-t border-black/10">
      <th className="bg-mist p-4 text-sm font-semibold text-ink/60">{label}</th>
      {values.map((value, index) => (
        <td key={`${label}-${index}`} className="border-l border-black/10 p-4 align-top font-medium text-ink/75">
          {value}
        </td>
      ))}
    </tr>
  );
}
