import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdBanner from "@/components/AdBanner";
import AddApplianceForm from "@/components/AddApplianceForm";
import ApplianceCard from "@/components/ApplianceCard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const appliances = await prisma.appliance.findMany({
    where: { userId: user.id },
    include: {
      category: true,
      manuals: true,
      maintenanceTasks: {
        orderBy: { nextDueAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.applianceCategory.findMany({
    orderBy: { name: "asc" },
  });

  // Get upcoming maintenance tasks across all appliances
  const upcomingTasks = await prisma.maintenanceTask.findMany({
    where: {
      appliance: { userId: user.id },
      status: { in: ["upcoming", "due", "overdue"] },
    },
    include: { appliance: true },
    orderBy: { nextDueAt: "asc" },
    take: 10,
  });

  // Determine overdue tasks
  const now = new Date();
  const overdueTasks = upcomingTasks.filter(
    (t) => new Date(t.nextDueAt) < now
  );
  const dueSoonTasks = upcomingTasks.filter((t) => {
    const due = new Date(t.nextDueAt);
    const inWeek = new Date();
    inWeek.setDate(inWeek.getDate() + 7);
    return due >= now && due <= inWeek;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-muted">
            Manage your appliances and stay on top of maintenance.
          </p>
        </div>
      </div>

      {/* Alert banners */}
      {overdueTasks.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">
            {overdueTasks.length} overdue maintenance{" "}
            {overdueTasks.length === 1 ? "task" : "tasks"}
          </p>
          <ul className="mt-2 space-y-1">
            {overdueTasks.map((t) => (
              <li key={t.id} className="text-sm text-red-700">
                {t.title} — {t.appliance.nickname || t.appliance.modelNumber}
              </li>
            ))}
          </ul>
          <Link
            href="/maintenance"
            className="mt-2 inline-block text-sm font-medium text-red-800 hover:underline"
          >
            View maintenance schedule &rarr;
          </Link>
        </div>
      )}

      {dueSoonTasks.length > 0 && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="font-semibold text-yellow-800">
            {dueSoonTasks.length} maintenance{" "}
            {dueSoonTasks.length === 1 ? "task" : "tasks"} due this week
          </p>
          <Link
            href="/maintenance"
            className="mt-1 inline-block text-sm font-medium text-yellow-800 hover:underline"
          >
            View schedule &rarr;
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Appliances"
          value={appliances.length.toString()}
        />
        <StatCard
          label="Upcoming Tasks"
          value={upcomingTasks.length.toString()}
        />
        <StatCard
          label="Overdue"
          value={overdueTasks.length.toString()}
          danger={overdueTasks.length > 0}
        />
        <StatCard
          label="Manuals"
          value={appliances
            .reduce((sum, a) => sum + a.manuals.length, 0)
            .toString()}
        />
      </div>

      {/* Ad */}
      <div className="my-6">
        <AdBanner slot="dashboard-top" format="horizontal" />
      </div>

      {/* Add Appliance */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Add an Appliance</h2>
        <p className="mt-1 text-sm text-muted">
          Enter a model number to automatically load manuals and set up
          maintenance reminders.
        </p>
        <AddApplianceForm categories={categories} />
      </div>

      {/* My Appliances */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">
          My Appliances ({appliances.length})
        </h2>
        {appliances.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted">
              No appliances added yet. Use the form above to add your first
              appliance.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {appliances.map((appliance) => (
              <ApplianceCard key={appliance.id} appliance={appliance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          danger ? "text-danger" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
