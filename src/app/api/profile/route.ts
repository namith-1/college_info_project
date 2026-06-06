import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  interestArea: z.string().trim().max(80).optional(),
  courseInterests: z.array(z.string().trim().max(80)).max(12).optional().default([]),
  preferredLocations: z.array(z.string().trim().max(80)).max(12).optional().default([])
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id }
  });

  return NextResponse.json({ data: profile });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const courseInterests = parsed.data.courseInterests.filter(Boolean);
  const preferredLocations = parsed.data.preferredLocations.filter(Boolean);
  const interestArea = parsed.data.interestArea || null;

  const profile = await prisma.studentProfile.upsert({
    where: { userId: session.user.id },
    update: { interestArea, courseInterests, preferredLocations },
    create: {
      userId: session.user.id,
      interestArea,
      courseInterests,
      preferredLocations
    }
  });

  return NextResponse.json({ data: profile });
}
