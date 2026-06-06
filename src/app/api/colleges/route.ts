import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { collegeSearchSchema } from "@/lib/validations";

const MAX_DISCOVERY_PAGES = 2;

function getOrderBy(sort: string): Prisma.CollegeOrderByWithRelationInput[] {
  if (sort === "rating") return [{ rating: "desc" }, { reviewCount: "desc" }];
  if (sort === "fees_asc") return [{ feesMin: "asc" }];
  if (sort === "fees_desc") return [{ feesMax: "desc" }];
  if (sort === "package") return [{ placement: { averagePackage: "desc" } }];
  return [{ rating: "desc" }, { reviewCount: "desc" }];
}

function getTypeFromInterest(interestArea?: string | null) {
  const normalized = interestArea?.toLowerCase();
  if (!normalized) return null;
  if (["science", "engineering"].includes(normalized)) return "ENGINEERING";
  if (["commerce", "management"].includes(normalized)) return "MANAGEMENT";
  if (normalized === "medical") return "MEDICAL";
  return null;
}

export async function GET(request: NextRequest) {
  const parsed = collegeSearchSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { q, city, state, course, exam, minFees, maxFees, minRating, sort, limit } = parsed.data;
  const page = Math.min(parsed.data.page, MAX_DISCOVERY_PAGES);
  const where: Prisma.CollegeWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { state: { contains: q, mode: "insensitive" } },
            { courses: { some: { name: { contains: q, mode: "insensitive" } } } }
          ]
        }
      : {}),
    ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
    ...(state ? { state: { equals: state, mode: "insensitive" } } : {}),
    ...(course ? { courses: { some: { name: { contains: course, mode: "insensitive" } } } } : {}),
    ...(exam ? { cutoffs: { some: { exam: { code: exam } } } } : {}),
    ...(minFees || maxFees
      ? {
          AND: [
            minFees ? { feesMax: { gte: minFees } } : {},
            maxFees ? { feesMin: { lte: maxFees } } : {}
          ]
        }
      : {}),
    ...(minRating ? { rating: { gte: minRating } } : {})
  };

  const session = await getServerSession(authOptions);
  const profile =
    session?.user?.id && sort === "relevance"
      ? await prisma.studentProfile.findUnique({ where: { userId: session.user.id } })
      : null;

  const takeLimit = limit * MAX_DISCOVERY_PAGES;
  const include = {
    placement: true,
    courses: { take: 3, orderBy: { fees: "asc" as const } },
    cutoffs: { include: { exam: true }, take: 3 }
  };

  const [matchingTotal, rawColleges] = await prisma.$transaction([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: sort === "relevance" ? 0 : (page - 1) * limit,
      take: sort === "relevance" ? takeLimit : limit,
      include
    })
  ]);

  const accessibleTotal = Math.min(matchingTotal, limit * MAX_DISCOVERY_PAGES);
  const pageCount = Math.max(1, Math.ceil(accessibleTotal / limit));
  const preferredType = getTypeFromInterest(profile?.interestArea);
  const preferredCourses = profile?.courseInterests.map((item) => item.toLowerCase()) ?? [];
  const preferredLocations = profile?.preferredLocations.map((item) => item.toLowerCase()) ?? [];

  const colleges =
    sort === "relevance"
      ? rawColleges
          .map((college) => {
            const courseMatch = preferredCourses.some((preference) =>
              college.courses.some((course) => course.name.toLowerCase().includes(preference))
            );
            const locationMatch = preferredLocations.some((preference) =>
              [college.city, college.state].some((location) => location.toLowerCase().includes(preference))
            );
            const typeMatch = preferredType === college.type;

            return {
              college,
              score:
                college.rating * 20 +
                (college.placement?.averagePackage ?? 0) +
                Math.min(college.reviewCount / 100, 12) +
                (typeMatch ? 60 : 0) +
                (courseMatch ? 45 : 0) +
                (locationMatch ? 35 : 0)
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice((page - 1) * limit, page * limit)
          .map((item) => item.college)
      : rawColleges;

  return NextResponse.json({
    data: colleges,
    meta: {
      total: accessibleTotal,
      matchingTotal,
      page,
      limit,
      pageCount,
      maxPages: MAX_DISCOVERY_PAGES
    }
  });
}
