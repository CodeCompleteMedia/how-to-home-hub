import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const task = await prisma.maintenanceTask.findUnique({
    where: { id },
    include: { appliance: true },
  });

  if (!task || task.appliance.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date();
  const nextDueAt = new Date();
  nextDueAt.setMonth(nextDueAt.getMonth() + task.intervalMonths);

  if (task.isRecurring) {
    // Mark completed and schedule next occurrence
    await prisma.maintenanceTask.update({
      where: { id },
      data: {
        lastCompletedAt: now,
        nextDueAt,
        status: "upcoming",
      },
    });
  } else {
    await prisma.maintenanceTask.update({
      where: { id },
      data: {
        lastCompletedAt: now,
        status: "completed",
      },
    });
  }

  return NextResponse.json({ success: true });
}
