import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, IndianRupee, MapPin, Star, Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatFees } from "@/lib/format";
import { SaveCollegeButton } from "@/components/saved/SaveCollegeButton";
import { FallbackImage } from "@/components/ui/FallbackImage";

export const dynamic = "force-dynamic";

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      placement: true,
      courses: { orderBy: [{ degree: "asc" }, { fees: "asc" }] },
      reviews: { orderBy: { createdAt: "desc" } },
      cutoffs: { include: { exam: true }, orderBy: { minRank: "asc" } }
    }
  });

  if (!college) notFound();

  const saved = session?.user?.id
    ? Boolean(
        await prisma.savedCollege.findUnique({
          where: {
            userId_collegeId: {
              userId: session.user.id,
              collegeId: college.id
            }
          }
        })
      )
    : false;

  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-moss">
            <ArrowLeft size={16} /> Back to discovery
          </Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="overflow-hidden rounded-lg">
                <FallbackImage src={college.imageUrl} alt="" className="h-72 w-full object-cover sm:h-96" />
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-coral">{college.ownership.toLowerCase()} {college.type.toLowerCase()}</p>
                <h1 className="mt-2 text-3xl font-bold text-ink sm:text-5xl">{college.name}</h1>
                <p className="mt-3 flex items-center gap-2 text-ink/60">
                  <MapPin size={18} /> {college.city}, {college.state}
                </p>
                <p className="mt-5 max-w-4xl text-base leading-8 text-ink/70">{college.overview}</p>
              </div>
            </div>
            <aside className="h-fit rounded-lg border border-black/10 bg-mist p-5">
              <div className="grid gap-3">
                <Stat icon={<Star />} label="Rating" value={`${college.rating.toFixed(1)} / 5`} />
                <Stat icon={<IndianRupee />} label="Fees range" value={formatFees(college.feesMin, college.feesMax)} />
                <Stat icon={<BarChart3 />} label="Average package" value={`${college.placement?.averagePackage ?? "-"} LPA`} />
                <Stat icon={<Users />} label="Placement rate" value={`${college.placement?.placementRate ?? "-"}%`} />
              </div>
              <div className="mt-4 grid gap-2">
                <SaveCollegeButton collegeId={college.id} initialSaved={saved} />
                <Link href={`/compare?ids=${college.id}`} className="block rounded-md bg-moss px-4 py-3 text-center text-sm font-semibold text-white">
                  Add to comparison
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel title="Courses and Fees">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-mist text-xs uppercase text-ink/50">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Degree</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Seats</th>
                    <th className="px-4 py-3">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {college.courses.map((course) => (
                    <tr key={course.id} className="border-t border-black/10">
                      <td className="px-4 py-3 font-semibold text-ink">{course.name}</td>
                      <td className="px-4 py-3 text-ink/65">{course.degree}</td>
                      <td className="px-4 py-3 text-ink/65">{course.duration}</td>
                      <td className="px-4 py-3 text-ink/65">{course.seats}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(course.fees)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Student Reviews">
            <div className="grid gap-4 sm:grid-cols-2">
              {college.reviews.map((review) => (
                <article key={review.id} className="rounded-lg border border-black/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-ink">{review.title}</h3>
                    <span className="rounded-md bg-gold/10 px-2 py-1 text-xs font-bold text-ink">{review.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink/50">{review.authorName}</p>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{review.body}</p>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Placements">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-ink/60">Highest package</span><strong>{college.placement?.highestPackage} LPA</strong></div>
              <div className="flex justify-between"><span className="text-ink/60">Average package</span><strong>{college.placement?.averagePackage} LPA</strong></div>
              <div className="flex justify-between"><span className="text-ink/60">Placement rate</span><strong>{college.placement?.placementRate}%</strong></div>
              <div className="pt-2">
                <p className="mb-2 font-semibold text-ink">Top recruiters</p>
                <div className="flex flex-wrap gap-2">
                  {college.placement?.topRecruiters.map((recruiter) => (
                    <span key={recruiter} className="rounded-md bg-mist px-2.5 py-1 text-xs font-medium text-ink/70">{recruiter}</span>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Exam Cutoffs">
            <div className="space-y-3">
              {college.cutoffs.map((cutoff) => (
                <div key={cutoff.id} className="rounded-md border border-black/10 p-3 text-sm">
                  <div className="font-semibold text-ink">{cutoff.exam.name}</div>
                  <div className="mt-1 text-ink/65">{cutoff.courseName}</div>
                  <div className="mt-2 font-medium text-moss">Rank {cutoff.minRank.toLocaleString("en-IN")} - {cutoff.maxRank.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </section>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactElement; label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-ink/45">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-ink">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-xl font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
