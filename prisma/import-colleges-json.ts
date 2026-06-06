import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient, CollegeType, Ownership } from "@prisma/client";
import { z } from "zod";

if (!process.env.DATABASE_URL) {
  process.loadEnvFile?.();
}

const prisma = new PrismaClient();

const collegeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  type: z.nativeEnum(CollegeType),
  ownership: z.nativeEnum(Ownership),
  overview: z.string().min(1),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  feesMin: z.number().int().nonnegative(),
  feesMax: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
  placement: z.object({
    averagePackage: z.number().nonnegative(),
    highestPackage: z.number().nonnegative(),
    placementRate: z.number().int().min(0).max(100),
    topRecruiters: z.array(z.string()).default([])
  }),
  courses: z.array(
    z.object({
      name: z.string().min(1),
      degree: z.string().min(1),
      duration: z.string().min(1),
      fees: z.number().int().nonnegative(),
      seats: z.number().int().nonnegative()
    })
  ),
  reviews: z
    .array(
      z.object({
        authorName: z.string().min(1),
        rating: z.number().min(0).max(5),
        title: z.string().min(1),
        body: z.string().min(1)
      })
    )
    .default([]),
  cutoffs: z
    .array(
      z.object({
        examCode: z.string().min(1),
        examName: z.string().min(1),
        courseName: z.string().min(1),
        minRank: z.number().int().positive(),
        maxRank: z.number().int().positive(),
        category: z.string().min(1)
      })
    )
    .default([])
});

const fileArg = process.argv[2] ?? "data/collegedunia-colleges-100.json";
const filePath = path.resolve(process.cwd(), fileArg);

async function main() {
  const raw = await fs.readFile(filePath, "utf8");
  const colleges = z.array(collegeSchema).parse(JSON.parse(raw));
  const slugs = colleges.map((college) => college.slug);

  const examInputs = new Map<string, string>();
  for (const college of colleges) {
    for (const cutoff of college.cutoffs) {
      examInputs.set(cutoff.examCode, cutoff.examName);
    }
  }

  await prisma.$transaction(
    [...examInputs.entries()].map(([code, name]) =>
      prisma.exam.upsert({
        where: { code },
        update: { name },
        create: { code, name }
      })
    )
  );

  await prisma.$transaction(
    colleges.map((college) =>
      prisma.college.upsert({
        where: { slug: college.slug },
        update: {
          name: college.name,
          city: college.city,
          state: college.state,
          type: college.type,
          ownership: college.ownership,
          overview: college.overview,
          rating: college.rating,
          reviewCount: college.reviewCount,
          feesMin: college.feesMin,
          feesMax: college.feesMax,
          imageUrl: college.imageUrl
        },
        create: {
          name: college.name,
          slug: college.slug,
          city: college.city,
          state: college.state,
          type: college.type,
          ownership: college.ownership,
          overview: college.overview,
          rating: college.rating,
          reviewCount: college.reviewCount,
          feesMin: college.feesMin,
          feesMax: college.feesMax,
          imageUrl: college.imageUrl
        }
      })
    )
  );

  const [createdColleges, exams] = await Promise.all([
    prisma.college.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } }),
    prisma.exam.findMany({ select: { id: true, code: true } })
  ]);

  const collegeIdBySlug = new Map(createdColleges.map((college) => [college.slug, college.id]));
  const examIdByCode = new Map(exams.map((exam) => [exam.code, exam.id]));
  const collegeIds = createdColleges.map((college) => college.id);

  await prisma.$transaction([
    prisma.course.deleteMany({ where: { collegeId: { in: collegeIds } } }),
    prisma.review.deleteMany({ where: { collegeId: { in: collegeIds } } }),
    prisma.collegeExamCutoff.deleteMany({ where: { collegeId: { in: collegeIds } } }),
    prisma.placement.deleteMany({ where: { collegeId: { in: collegeIds } } })
  ]);

  const courseRows = colleges.flatMap((college) => {
    const collegeId = collegeIdBySlug.get(college.slug);
    if (!collegeId) return [];
    return college.courses.map((course) => ({ ...course, collegeId }));
  });

  const reviewRows = colleges.flatMap((college) => {
    const collegeId = collegeIdBySlug.get(college.slug);
    if (!collegeId) return [];
    return college.reviews.map((review) => ({ ...review, collegeId }));
  });

  const placementRows = [
    ...new Map(
      colleges.flatMap((college) => {
        const collegeId = collegeIdBySlug.get(college.slug);
        return collegeId ? [[collegeId, { ...college.placement, collegeId }] as const] : [];
      })
    ).values()
  ];

  const cutoffRows = colleges.flatMap((college) => {
    const collegeId = collegeIdBySlug.get(college.slug);
    if (!collegeId) return [];
    return college.cutoffs.flatMap((cutoff) => {
      const examId = examIdByCode.get(cutoff.examCode);
      if (!examId) return [];
      return {
        collegeId,
        examId,
        courseName: cutoff.courseName,
        minRank: cutoff.minRank,
        maxRank: cutoff.maxRank,
        category: cutoff.category
      };
    });
  });

  if (courseRows.length) {
    await prisma.course.createMany({ data: courseRows });
  }

  if (reviewRows.length) {
    await prisma.review.createMany({ data: reviewRows });
  }

  if (cutoffRows.length) {
    await prisma.collegeExamCutoff.createMany({ data: cutoffRows });
  }

  await prisma.$transaction(
    placementRows.map((placement) =>
      prisma.placement.upsert({
        where: { collegeId: placement.collegeId },
        update: {
          averagePackage: placement.averagePackage,
          highestPackage: placement.highestPackage,
          placementRate: placement.placementRate,
          topRecruiters: placement.topRecruiters
        },
        create: placement
      })
    )
  );

  console.log(`Imported ${colleges.length} colleges from ${filePath}`);
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
