"use client";

interface AdBannerProps {
  slot: string;
  format?: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdBanner({
  slot,
  format = "horizontal",
  className = "",
}: AdBannerProps) {
  const sizeClasses = {
    horizontal: "h-[90px] w-full max-w-[728px]",
    vertical: "h-[600px] w-[160px]",
    rectangle: "h-[250px] w-[300px]",
  };

  return (
    <div
      className={`mx-auto flex items-center justify-center rounded-lg border border-dashed border-border bg-card/50 text-xs text-muted ${sizeClasses[format]} ${className}`}
      data-ad-slot={slot}
      data-ad-format={format}
    >
      <div className="text-center">
        <p className="font-medium">Advertisement</p>
        <p className="mt-1 text-[10px]">Ad Slot: {slot}</p>
      </div>
    </div>
  );
}
