import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictorSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = predictorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { exam, rank, course, state } = parsed.data;
  const buffer = Math.max(1500, Math.floor(rank * 0.18));

  const cutoffs = await prisma.collegeExamCutoff.findMany({
    where: {
      exam: { code: exam },
      ...(course ? { courseName: { contains: course, mode: "insensitive" } } : {}),
      college: {
        ...(state ? { state: { equals: state, mode: "insensitive" } } : {})
      },
      minRank: { lte: rank + buffer },
      maxRank: { gte: Math.max(1, rank - buffer) }
    },
    include: {
      exam: true,
      college: {
        include: {
          placement: true,
          courses: { take: 3, orderBy: { fees: "asc" } }
        }
      }
    },
    take: 12
  });

  const ranked = cutoffs
    .map((cutoff) => {
      const insideRange = rank >= cutoff.minRank && rank <= cutoff.maxRank;
      const distance = insideRange
        ? 0
        : Math.min(Math.abs(rank - cutoff.minRank), Math.abs(rank - cutoff.maxRank));
      const confidence = insideRange ? "Likely" : distance <= buffer / 2 ? "Reach" : "Ambitious";

      return {
        cutoff,
        score:
          (insideRange ? 100 : Math.max(1, 70 - distance / 250)) +
          cutoff.college.rating * 5 +
          (cutoff.college.placement?.averagePackage ?? 0)
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ cutoff }) => ({
      college: cutoff.college,
      exam: cutoff.exam,
      courseName: cutoff.courseName,
      minRank: cutoff.minRank,
      maxRank: cutoff.maxRank,
      category: cutoff.category,
      confidence:
        rank >= cutoff.minRank && rank <= cutoff.maxRank
          ? "Likely"
          : Math.abs(rank - cutoff.maxRank) <= buffer / 2
            ? "Reach"
            : "Ambitious",
      reason:
        rank >= cutoff.minRank && rank <= cutoff.maxRank
          ? "Your rank falls inside the previous cutoff range."
          : "Your rank is close to the previous cutoff range, so this is worth tracking."
    }));

  return NextResponse.json({ data: ranked });
}
