import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [colleges, courses, exams] = await prisma.$transaction([
    prisma.college.findMany({ select: { city: true, state: true } }),
    prisma.course.findMany({ distinct: ["name"], select: { name: true }, orderBy: { name: "asc" } }),
    prisma.exam.findMany({ select: { code: true, name: true }, orderBy: { name: "asc" } })
  ]);

  return NextResponse.json({
    cities: [...new Set(colleges.map((college) => college.city))].sort(),
    states: [...new Set(colleges.map((college) => college.state))].sort(),
    courses: courses.map((course) => course.name),
    exams
  });
}
