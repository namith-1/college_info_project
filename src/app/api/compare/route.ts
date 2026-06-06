import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams
    .get("ids")
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (!ids?.length) {
    return NextResponse.json({ data: [] });
  }

  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: {
      placement: true,
      courses: { orderBy: { fees: "asc" }, take: 4 },
      cutoffs: { include: { exam: true }, take: 4 }
    }
  });

  const ordered = ids.map((id) => colleges.find((college) => college.id === id)).filter(Boolean);
  return NextResponse.json({ data: ordered });
}
