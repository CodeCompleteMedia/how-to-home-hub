"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  nextDueAt: Date | string;
  lastCompletedAt: Date | string | null;
  priority: string;
  status: string;
  intervalMonths: number;
  appliance: {
    nickname: string | null;
    modelNumber: string;
    category: { name: string };
  };
}

export default function MaintenanceTaskRow({ task }: { task: Task }) {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    high: "border-l-danger",
    medium: "border-l-accent",
    low: "border-l-primary",
  };

  const dueDate = new Date(task.nextDueAt);
  const isOverdue = dueDate < new Date() && task.status !== "completed";

  async function handleComplete() {
    setCompleting(true);
    await fetch(`/api/maintenance/${task.id}/complete`, { method: "POST" });
    router.refresh();
  }

  return (
    <div
      className={`rounded-lg border border-border bg-card border-l-4 ${
        priorityColors[task.priority as keyof typeof priorityColors] ||
        "border-l-border"
      }`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{task.title}</h3>
            <span className="rounded bg-primary-light/50 px-1.5 py-0.5 text-xs text-muted">
              {task.appliance.nickname || task.appliance.modelNumber}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {task.appliance.category.name} &middot; Every{" "}
            {task.intervalMonths} month{task.intervalMonths > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm ${
              isOverdue ? "font-semibold text-danger" : "text-muted"
            }`}
          >
            {task.status === "completed"
              ? `Done ${
                  task.lastCompletedAt
                    ? new Date(task.lastCompletedAt).toLocaleDateString()
                    : ""
                }`
              : `Due ${dueDate.toLocaleDateString()}`}
          </span>
          {task.status !== "completed" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
              disabled={completing}
              className="rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {completing ? "..." : "Done"}
            </button>
          )}
        </div>
      </div>

      {expanded && task.description && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-sm text-muted">{task.description}</p>
          {task.lastCompletedAt && (
            <p className="mt-2 text-xs text-muted">
              Last completed:{" "}
              {new Date(task.lastCompletedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
