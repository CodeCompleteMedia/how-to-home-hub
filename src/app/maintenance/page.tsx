import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdBanner from "@/components/AdBanner";
import MaintenanceTaskRow from "@/components/MaintenanceTaskRow";

export default async function MaintenancePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const tasks = await prisma.maintenanceTask.findMany({
    where: {
      appliance: { userId: user.id },
    },
    include: {
      appliance: {
        include: { category: true },
      },
    },
    orderBy: { nextDueAt: "asc" },
  });

  const now = new Date();
  const overdue = tasks.filter(
    (t) => t.status !== "completed" && new Date(t.nextDueAt) < now
  );
  const dueSoon = tasks.filter((t) => {
    if (t.status === "completed") return false;
    const due = new Date(t.nextDueAt);
    const inMonth = new Date();
    inMonth.setMonth(inMonth.getMonth() + 1);
    return due >= now && due <= inMonth;
  });
  const upcoming = tasks.filter((t) => {
    if (t.status === "completed") return false;
    const due = new Date(t.nextDueAt);
    const inMonth = new Date();
    inMonth.setMonth(inMonth.getMonth() + 1);
    return due > inMonth;
  });
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
          <p className="text-sm text-muted">
            Keep track of all your home maintenance tasks. Mark them complete
            to reschedule automatically.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Overdue"
          count={overdue.length}
          color="text-danger"
        />
        <SummaryCard
          label="Due This Month"
          count={dueSoon.length}
          color="text-accent-dark"
        />
        <SummaryCard
          label="Upcoming"
          count={upcoming.length}
          color="text-primary"
        />
        <SummaryCard
          label="Completed"
          count={completed.length}
          color="text-success"
        />
      </div>

      {/* Ad */}
      <div className="my-6">
        <AdBanner slot="maintenance-top" format="horizontal" />
      </div>

      {tasks.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">
            No maintenance tasks yet. Add appliances from your{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              dashboard
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {/* Overdue */}
          {overdue.length > 0 && (
            <TaskSection title="Overdue" badge="danger" tasks={overdue} />
          )}

          {/* Due This Month */}
          {dueSoon.length > 0 && (
            <TaskSection
              title="Due This Month"
              badge="warning"
              tasks={dueSoon}
            />
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <TaskSection title="Upcoming" badge="info" tasks={upcoming} />
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <TaskSection
              title="Completed"
              badge="success"
              tasks={completed}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{count}</p>
    </div>
  );
}

interface TaskWithAppliance {
  id: string;
  title: string;
  description: string | null;
  nextDueAt: Date;
  lastCompletedAt: Date | null;
  priority: string;
  status: string;
  intervalMonths: number;
  appliance: {
    nickname: string | null;
    modelNumber: string;
    category: { name: string };
  };
}

function TaskSection({
  title,
  badge,
  tasks,
}: {
  title: string;
  badge: "danger" | "warning" | "info" | "success";
  tasks: TaskWithAppliance[];
}) {
  const badgeClasses = {
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClasses[badge]}`}
        >
          {tasks.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {tasks.map((task) => (
          <MaintenanceTaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
