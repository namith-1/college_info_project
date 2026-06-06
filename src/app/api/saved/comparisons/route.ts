import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const savedComparisonSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  collegeIds: z.array(z.string().min(1)).min(2).max(3)
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const comparisons = await prisma.savedComparison.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  const collegeIds = [...new Set(comparisons.flatMap((comparison) => comparison.collegeIds))];
  const colleges = await prisma.college.findMany({
    where: { id: { in: collegeIds } },
    include: {
      placement: true,
      courses: { take: 3, orderBy: { fees: "asc" } },
      cutoffs: { include: { exam: true }, take: 3 }
    }
  });

  return NextResponse.json({
    data: comparisons.map((comparison) => ({
      ...comparison,
      colleges: comparison.collegeIds.map((id) => colleges.find((college) => college.id === id)).filter(Boolean)
    }))
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = savedComparisonSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const colleges = await prisma.college.findMany({
    where: { id: { in: parsed.data.collegeIds } },
    select: { id: true, name: true }
  });
  if (colleges.length !== parsed.data.collegeIds.length) {
    return NextResponse.json({ error: "One or more colleges were not found." }, { status: 404 });
  }

  const comparison = await prisma.savedComparison.create({
    data: {
      userId: session.user.id,
      collegeIds: parsed.data.collegeIds,
      name: parsed.data.name || colleges.map((college) => college.name.split(" ").slice(0, 3).join(" ")).join(" vs ")
    }
  });

  return NextResponse.json({ data: comparison }, { status: 201 });
}
