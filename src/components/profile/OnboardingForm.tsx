"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const interestAreas = ["Science", "Arts", "Commerce", "Engineering", "Management", "Medical", "Design", "Law"];
const courseOptions = ["Computer Science", "Data Science", "Mechanical Engineering", "MBA", "MBBS", "Economics", "Psychology", "Design"];
const locationOptions = ["Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat", "West Bengal", "Telangana", "Kerala"];

export function OnboardingForm() {
  const router = useRouter();
  const { status } = useSession();
  const [interestArea, setInterestArea] = useState("");
  const [courseInterests, setCourseInterests] = useState<string[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-black/10 bg-white p-6 text-center shadow-soft">
        <h1 className="text-2xl font-bold text-ink">Sign in first</h1>
        <p className="mt-2 text-sm text-ink/60">Create an account or sign in before saving your student preferences.</p>
        <Link href="/signin" className="mt-5 inline-block rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
          Sign in
        </Link>
      </div>
    );
  }

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interestArea, courseInterests, preferredLocations })
    });
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl rounded-lg border border-black/10 bg-white p-6 shadow-soft">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-coral">Optional setup</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Tell us what you are exploring</h1>
        <p className="mt-2 text-sm leading-6 text-ink/62">
          These preferences are optional and help shape your college shortlist later.
        </p>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-bold text-ink">Area of interest</h2>
        <div className="flex flex-wrap gap-2">
          {interestAreas.map((area) => (
            <button
              type="button"
              key={area}
              onClick={() => setInterestArea(interestArea === area ? "" : area)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                interestArea === area ? "border-moss bg-moss text-white" : "border-black/15 bg-white text-ink hover:bg-mist"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-bold text-ink">Course interests</h2>
        <div className="flex flex-wrap gap-2">
          {courseOptions.map((course) => (
            <button
              type="button"
              key={course}
              onClick={() => toggle(courseInterests, course, setCourseInterests)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                courseInterests.includes(course) ? "border-gold bg-gold text-ink" : "border-black/15 bg-white text-ink hover:bg-mist"
              }`}
            >
              {course}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-bold text-ink">Preferred locations</h2>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((location) => (
            <button
              type="button"
              key={location}
              onClick={() => toggle(preferredLocations, location, setPreferredLocations)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                preferredLocations.includes(location) ? "border-coral bg-coral text-white" : "border-black/15 bg-white text-ink hover:bg-mist"
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="rounded-md px-4 py-2 text-sm font-bold text-ink/60 hover:bg-mist">
          Skip for now
        </Link>
        <button disabled={loading} className="rounded-md bg-coral px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
          {loading ? "Saving" : "Save preferences"}
        </button>
      </div>
    </form>
  );
}
