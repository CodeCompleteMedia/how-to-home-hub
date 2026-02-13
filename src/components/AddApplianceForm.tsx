"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function AddApplianceForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      categoryId: formData.get("categoryId") as string,
      modelNumber: formData.get("modelNumber") as string,
      brand: formData.get("brand") as string,
      nickname: formData.get("nickname") as string,
      location: formData.get("location") as string,
      purchaseDate: formData.get("purchaseDate") as string,
    };

    try {
      const res = await fetch("/api/appliances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to add appliance");
        setLoading(false);
        return;
      }

      setSuccess(
        `${result.nickname || result.modelNumber} added with ${result.maintenanceTasks?.length || 0} maintenance tasks!`
      );
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border border-border bg-card p-6"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="modelNumber" className="block text-sm font-medium">
            Model Number *
          </label>
          <input
            id="modelNumber"
            name="modelNumber"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. WFW9620HW"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium">
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Whirlpool"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium">
            Nickname
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Kitchen Fridge"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Basement, Kitchen"
          />
        </div>

        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium">
            Purchase Date
          </label>
          <input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Appliance"}
        </button>
      </div>
    </form>
  );
}
