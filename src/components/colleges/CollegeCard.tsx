"use client";

import Link from "next/link";
import { BarChart3, Bookmark, IndianRupee, MapPin, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import type { College } from "@/types";
import { formatFees } from "@/lib/format";
import { FallbackImage } from "@/components/ui/FallbackImage";

export function CollegeCard({
  college,
  selected,
  saved,
  onCompare,
  onSave
}: {
  college: College;
  selected: boolean;
  saved: boolean;
  onCompare: (college: College) => void;
  onSave: (college: College, nextSaved: boolean) => void;
}) {
  const { data: session } = useSession();

  return (
    <article className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-soft">
      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        <Link href={`/colleges/${college.slug}`} className="block min-h-48 bg-ink/10">
          <FallbackImage className="h-full w-full object-cover" src={college.imageUrl} alt="" />
        </Link>
        <div className="flex min-w-0 flex-col p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link href={`/colleges/${college.slug}`} className="text-xl font-semibold text-ink hover:text-moss">
                {college.name}
              </Link>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink/60">
                <MapPin size={15} />
                {college.city}, {college.state}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-gold/10 px-2.5 py-1 text-sm font-semibold text-ink">
              <Star size={15} className="fill-gold text-gold" />
              {college.rating.toFixed(1)}
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/68">{college.overview}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric icon={<IndianRupee size={16} />} label="Fees" value={formatFees(college.feesMin, college.feesMax)} />
            <Metric icon={<BarChart3 size={16} />} label="Avg package" value={`${college.placement?.averagePackage ?? "-"} LPA`} />
            <Metric icon={<Star size={16} />} label="Reviews" value={`${college.reviewCount} reviews`} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {college.courses.slice(0, 3).map((course) => (
                <span key={course.id} className="rounded-md bg-mist px-2.5 py-1 text-xs font-medium text-ink/70">
                  {course.degree} {course.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => (session?.user ? onSave(college, !saved) : (window.location.href = "/signin"))}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  saved ? "bg-gold text-ink" : "border border-black/15 bg-white text-ink hover:bg-mist"
                }`}
              >
                <Bookmark size={15} className={saved ? "fill-ink" : ""} />
                {saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => onCompare(college)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  selected ? "bg-coral text-white" : "bg-moss text-white hover:bg-moss/90"
                }`}
              >
                {selected ? "Remove" : "Compare"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 p-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase text-ink/45">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
