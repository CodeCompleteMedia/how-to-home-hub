// Default maintenance schedules by appliance category
// These are loaded when a user adds an appliance

export interface DefaultTask {
  title: string;
  description: string;
  intervalMonths: number;
  priority: "low" | "medium" | "high";
}

export const DEFAULT_MAINTENANCE_TASKS: Record<string, DefaultTask[]> = {
  HVAC: [
    {
      title: "Replace air filter",
      description:
        "Replace or clean the HVAC air filter to maintain air quality and system efficiency.",
      intervalMonths: 3,
      priority: "high",
    },
    {
      title: "Professional HVAC inspection",
      description:
        "Schedule a professional inspection and tune-up for your heating and cooling system.",
      intervalMonths: 12,
      priority: "medium",
    },
    {
      title: "Clean air vents and registers",
      description:
        "Remove dust and debris from all air vents and registers throughout the home.",
      intervalMonths: 6,
      priority: "low",
    },
    {
      title: "Check thermostat calibration",
      description:
        "Verify thermostat accuracy and replace batteries if applicable.",
      intervalMonths: 12,
      priority: "low",
    },
  ],
  Plumbing: [
    {
      title: "Flush water heater",
      description:
        "Drain and flush the water heater tank to remove sediment buildup.",
      intervalMonths: 12,
      priority: "medium",
    },
    {
      title: "Check for leaks",
      description:
        "Inspect all visible pipes, faucets, and connections for signs of leaks.",
      intervalMonths: 6,
      priority: "medium",
    },
    {
      title: "Test sump pump",
      description:
        "Pour water into the sump pit to verify the pump activates and drains properly.",
      intervalMonths: 3,
      priority: "high",
    },
    {
      title: "Clean drain traps",
      description:
        "Clear drain traps in sinks and showers to prevent clogs and odors.",
      intervalMonths: 3,
      priority: "low",
    },
  ],
  Kitchen: [
    {
      title: "Clean refrigerator coils",
      description:
        "Vacuum or brush the condenser coils on your refrigerator for optimal efficiency.",
      intervalMonths: 6,
      priority: "medium",
    },
    {
      title: "Deep clean oven",
      description:
        "Run self-clean cycle or manually deep clean the oven interior.",
      intervalMonths: 3,
      priority: "low",
    },
    {
      title: "Clean dishwasher filter",
      description:
        "Remove and clean the dishwasher filter and spray arms. Run a cleaning cycle.",
      intervalMonths: 1,
      priority: "medium",
    },
    {
      title: "Replace water filter",
      description:
        "Replace the water filter in your refrigerator or under-sink filtration system.",
      intervalMonths: 6,
      priority: "medium",
    },
  ],
  Laundry: [
    {
      title: "Clean dryer vent",
      description:
        "Disconnect and clean the dryer exhaust vent to prevent fire hazards.",
      intervalMonths: 6,
      priority: "high",
    },
    {
      title: "Clean washing machine",
      description:
        "Run a cleaning cycle with washer cleaner or vinegar. Clean the gasket and dispenser.",
      intervalMonths: 1,
      priority: "medium",
    },
    {
      title: "Inspect washing machine hoses",
      description:
        "Check supply hoses for bulges, cracks, or leaks. Replace if older than 5 years.",
      intervalMonths: 12,
      priority: "medium",
    },
  ],
  Electrical: [
    {
      title: "Test smoke detectors",
      description:
        "Press the test button on all smoke detectors and replace batteries as needed.",
      intervalMonths: 6,
      priority: "high",
    },
    {
      title: "Test GFCI outlets",
      description:
        "Press the test/reset buttons on GFCI outlets in kitchens, bathrooms, and outdoor areas.",
      intervalMonths: 6,
      priority: "medium",
    },
    {
      title: "Inspect electrical panel",
      description:
        "Check for tripped breakers, signs of overheating, or corrosion in the main panel.",
      intervalMonths: 12,
      priority: "medium",
    },
  ],
  Exterior: [
    {
      title: "Clean gutters",
      description:
        "Remove leaves and debris from gutters and downspouts. Check for proper drainage.",
      intervalMonths: 6,
      priority: "high",
    },
    {
      title: "Inspect roof",
      description:
        "Check for missing, cracked, or damaged shingles. Look for signs of wear around flashing.",
      intervalMonths: 12,
      priority: "medium",
    },
    {
      title: "Power wash exterior",
      description:
        "Clean siding, walkways, driveway, and deck surfaces with a pressure washer.",
      intervalMonths: 12,
      priority: "low",
    },
    {
      title: "Check caulking and weather stripping",
      description:
        "Inspect and replace caulking around windows and doors. Replace worn weather stripping.",
      intervalMonths: 12,
      priority: "medium",
    },
  ],
  "Water Treatment": [
    {
      title: "Replace water softener salt",
      description:
        "Check and refill the water softener brine tank with salt pellets.",
      intervalMonths: 2,
      priority: "medium",
    },
    {
      title: "Replace whole-house water filter",
      description:
        "Replace the filter cartridge in the whole-house water filtration system.",
      intervalMonths: 6,
      priority: "medium",
    },
  ],
};
