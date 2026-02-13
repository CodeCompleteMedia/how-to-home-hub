"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Appliance {
  id: string;
  nickname: string | null;
  brand: string | null;
  modelNumber: string;
  location: string | null;
  category: { name: string };
  manuals: { id: string; title: string; fileUrl: string; manualType: string }[];
  maintenanceTasks: {
    id: string;
    title: string;
    nextDueAt: string | Date;
    status: string;
    priority: string;
  }[];
}

export default function ApplianceCard({
  appliance,
}: {
  appliance: Appliance;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const upcomingTasks = appliance.maintenanceTasks.filter(
    (t) => t.status !== "completed"
  );
  const nextTask = upcomingTasks[0];
  const now = new Date();

  async function handleDelete() {
    if (!confirm("Are you sure you want to remove this appliance?")) return;
    setDeleting(true);
    await fetch(`/api/appliances/${appliance.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-muted">
            {appliance.category.name}
          </span>
          <h3 className="font-semibold">
            {appliance.nickname || appliance.modelNumber}
          </h3>
          {appliance.nickname && (
            <p className="text-sm text-muted">{appliance.modelNumber}</p>
          )}
          {appliance.brand && (
            <p className="text-xs text-muted">{appliance.brand}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-muted hover:text-danger transition-colors"
          title="Remove appliance"
        >
          {deleting ? "..." : "Remove"}
        </button>
      </div>

      {appliance.location && (
        <p className="mt-2 text-xs text-muted">
          Location: {appliance.location}
        </p>
      )}

      {/* Manuals */}
      {appliance.manuals.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted uppercase">Manuals</p>
          <div className="mt-1 space-y-1">
            {appliance.manuals.map((manual) => (
              <a
                key={manual.id}
                href={manual.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline"
              >
                {manual.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Next maintenance */}
      {nextTask && (
        <div className="mt-3 rounded-lg bg-primary-light/30 p-3">
          <p className="text-xs font-medium text-muted uppercase">
            Next Maintenance
          </p>
          <p className="mt-1 text-sm font-medium">{nextTask.title}</p>
          <p
            className={`text-xs ${
              new Date(nextTask.nextDueAt) < now
                ? "text-danger font-semibold"
                : "text-muted"
            }`}
          >
            {new Date(nextTask.nextDueAt) < now ? "OVERDUE — " : ""}
            Due: {new Date(nextTask.nextDueAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <p className="mt-3 text-xs text-muted">
        {upcomingTasks.length} upcoming{" "}
        {upcomingTasks.length === 1 ? "task" : "tasks"}
      </p>
    </div>
  );
}
