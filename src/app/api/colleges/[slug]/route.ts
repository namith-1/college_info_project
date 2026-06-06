import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: { orderBy: [{ degree: "asc" }, { fees: "asc" }] },
      placement: true,
      reviews: { orderBy: { createdAt: "desc" } },
      cutoffs: { include: { exam: true }, orderBy: { minRank: "asc" } }
    }
  });

  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  return NextResponse.json(college);
}
