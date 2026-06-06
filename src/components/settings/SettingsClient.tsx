"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Trash2 } from "lucide-react";
import { fetchJson } from "@/lib/api";
import { LoadingState } from "@/components/ui/LoadingState";

const interestAreas = ["Science", "Arts", "Commerce", "Engineering", "Management", "Medical", "Design", "Law"];
const courseOptions = ["Computer Science", "Data Science", "Mechanical Engineering", "MBA", "MBBS", "Economics", "Psychology", "Design"];
const locationOptions = ["Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat", "West Bengal", "Telangana", "Kerala"];

type StudentProfile = {
  interestArea: string | null;
  courseInterests: string[];
  preferredLocations: string[];
};

export function SettingsClient() {
  const { data: session, status } = useSession();
  const [interestArea, setInterestArea] = useState("");
  const [courseInterests, setCourseInterests] = useState<string[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    fetchJson<{ data: StudentProfile | null }>("/api/profile").then((response) => {
      setInterestArea(response.data?.interestArea ?? "");
      setCourseInterests(response.data?.courseInterests ?? []);
      setPreferredLocations(response.data?.preferredLocations ?? []);
    });
  }, [session?.user]);

  if (status === "loading") return <LoadingState label="Loading settings" />;

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-black/10 bg-white p-6 text-center shadow-soft">
        <h1 className="text-2xl font-bold text-ink">Sign in required</h1>
        <p className="mt-2 text-sm text-ink/60">Sign in to manage preferences and account settings.</p>
        <Link href="/signin" className="mt-5 inline-block rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
          Sign in
        </Link>
      </div>
    );
  }

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
    setSaved(false);
  }

  async function savePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interestArea, courseInterests, preferredLocations })
    });
    setSaving(false);
    setSaved(true);
  }

  async function deleteAccount() {
    if (confirmDelete !== "DELETE") return;
    setDeleting(true);
    const response = await fetch("/api/account", { method: "DELETE" });
    if (response.ok) {
      await signOut({ callbackUrl: "/" });
      return;
    }
    setDeleting(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form onSubmit={savePreferences} className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">Student preferences</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Update your discovery profile</h1>
          <p className="mt-2 text-sm leading-6 text-ink/62">All fields are optional. Changes are saved to your account.</p>
        </div>

        <Section title="Area of interest">
          {interestAreas.map((area) => (
            <Choice key={area} active={interestArea === area} onClick={() => { setInterestArea(interestArea === area ? "" : area); setSaved(false); }}>
              {area}
            </Choice>
          ))}
        </Section>

        <Section title="Course interests">
          {courseOptions.map((course) => (
            <Choice key={course} active={courseInterests.includes(course)} onClick={() => toggle(courseInterests, course, setCourseInterests)}>
              {course}
            </Choice>
          ))}
        </Section>

        <Section title="Preferred locations">
          {locationOptions.map((location) => (
            <Choice key={location} active={preferredLocations.includes(location)} onClick={() => toggle(preferredLocations, location, setPreferredLocations)}>
              {location}
            </Choice>
          ))}
        </Section>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button disabled={saving} className="rounded-md bg-coral px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
            {saving ? "Saving" : "Save preferences"}
          </button>
          {saved && <span className="text-sm font-semibold text-moss">Preferences saved</span>}
        </div>
      </form>

      <aside className="space-y-6">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Account</h2>
          <p className="mt-1 text-sm text-ink/60">{session.user.email}</p>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-moss px-4 py-3 text-sm font-bold text-white"
          >
            <LogOut size={17} /> Log out
          </button>
        </section>

        <section className="rounded-lg border border-coral/25 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-coral">Delete account</h2>
          <p className="mt-2 text-sm leading-6 text-ink/62">
            This removes your account, saved colleges, saved comparisons, sessions, and preferences.
          </p>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-ink/70">Type DELETE to confirm</span>
            <input className="input" value={confirmDelete} onChange={(event) => setConfirmDelete(event.target.value)} />
          </label>
          <button
            type="button"
            disabled={confirmDelete !== "DELETE" || deleting}
            onClick={deleteAccount}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-coral px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <Trash2 size={17} /> {deleting ? "Deleting" : "Delete account"}
          </button>
        </section>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-bold text-ink">{title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm font-semibold ${
        active ? "border-moss bg-moss text-white" : "border-black/15 bg-white text-ink hover:bg-mist"
      }`}
    >
      {children}
    </button>
  );
}
