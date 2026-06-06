import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const savedCollegeSchema = z.object({
  collegeId: z.string().min(1)
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      college: {
        include: {
          placement: true,
          courses: { take: 3, orderBy: { fees: "asc" } },
          cutoffs: { include: { exam: true }, take: 3 }
        }
      }
    }
  });

  return NextResponse.json({ data: saved.map((item) => item.college) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = savedCollegeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await prisma.savedCollege.upsert({
    where: {
      userId_collegeId: {
        userId: session.user.id,
        collegeId: parsed.data.collegeId
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      collegeId: parsed.data.collegeId
    }
  });

  return NextResponse.json({ saved: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = savedCollegeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await prisma.savedCollege.deleteMany({
    where: {
      userId: session.user.id,
      collegeId: parsed.data.collegeId
    }
  });

  return NextResponse.json({ saved: false });
}
