import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
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

  const [matchingTotal, colleges] = await prisma.$transaction([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: (page - 1) * limit,
      take: limit,
      include: {
        placement: true,
        courses: { take: 3, orderBy: { fees: "asc" } },
        cutoffs: { include: { exam: true }, take: 3 }
      }
    })
  ]);

  const accessibleTotal = Math.min(matchingTotal, limit * MAX_DISCOVERY_PAGES);
  const pageCount = Math.max(1, Math.ceil(accessibleTotal / limit));

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
