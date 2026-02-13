import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  DEFAULT_MAINTENANCE_TASKS,
  DefaultTask,
} from "@/lib/maintenance-schedules";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appliances = await prisma.appliance.findMany({
    where: { userId: session.userId },
    include: {
      category: true,
      manuals: true,
      maintenanceTasks: {
        orderBy: { nextDueAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(appliances);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      categoryId,
      modelNumber,
      brand,
      nickname,
      serialNumber,
      purchaseDate,
      warrantyEnd,
      location,
      notes,
    } = body;

    if (!categoryId || !modelNumber) {
      return NextResponse.json(
        { error: "Category and model number are required" },
        { status: 400 }
      );
    }

    // Create the appliance
    const appliance = await prisma.appliance.create({
      data: {
        userId: session.userId,
        categoryId,
        modelNumber,
        brand: brand || null,
        nickname: nickname || null,
        serialNumber: serialNumber || null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        warrantyEnd: warrantyEnd ? new Date(warrantyEnd) : null,
        location: location || null,
        notes: notes || null,
      },
      include: { category: true },
    });

    // Auto-create maintenance tasks based on category
    const categoryName = appliance.category.name;
    const defaultTasks: DefaultTask[] =
      DEFAULT_MAINTENANCE_TASKS[categoryName] || [];

    for (const task of defaultTasks) {
      const nextDueAt = new Date();
      nextDueAt.setMonth(nextDueAt.getMonth() + task.intervalMonths);

      await prisma.maintenanceTask.create({
        data: {
          applianceId: appliance.id,
          title: task.title,
          description: task.description,
          intervalMonths: task.intervalMonths,
          nextDueAt,
          priority: task.priority,
        },
      });
    }

    // Auto-create a placeholder manual entry
    await prisma.applianceManual.create({
      data: {
        applianceId: appliance.id,
        title: `${brand || ""} ${modelNumber} Owner's Manual`.trim(),
        fileUrl: `https://www.google.com/search?q=${encodeURIComponent(
          `${brand || ""} ${modelNumber} owner's manual PDF`.trim()
        )}`,
        manualType: "owner_manual",
      },
    });

    const result = await prisma.appliance.findUnique({
      where: { id: appliance.id },
      include: {
        category: true,
        manuals: true,
        maintenanceTasks: true,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add appliance" },
      { status: 500 }
    );
  }
}
