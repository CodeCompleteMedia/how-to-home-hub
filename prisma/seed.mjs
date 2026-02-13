// Seed script for How to Home Hub
// Uses Prisma client for PostgreSQL compatibility

import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function seed() {
  // ─── Categories ───
  const categoriesData = [
    { name: "HVAC", icon: "thermometer", description: "Heating, ventilation, and air conditioning systems including furnaces, AC units, and heat pumps." },
    { name: "Plumbing", icon: "droplets", description: "Water heaters, pipes, faucets, toilets, sump pumps, and water supply systems." },
    { name: "Kitchen", icon: "chef-hat", description: "Refrigerators, ovens, dishwashers, microwaves, and other kitchen appliances." },
    { name: "Laundry", icon: "shirt", description: "Washing machines, dryers, and laundry care systems." },
    { name: "Electrical", icon: "zap", description: "Electrical panels, outlets, smoke detectors, and home wiring systems." },
    { name: "Exterior", icon: "home", description: "Roof, gutters, siding, windows, doors, and outdoor structures." },
    { name: "Water Treatment", icon: "glass-water", description: "Water softeners, filtration systems, and water purification." },
  ];

  const catIds = {};
  for (const cat of categoriesData) {
    const result = await prisma.applianceCategory.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon, description: cat.description },
      create: cat,
    });
    catIds[cat.name] = result.id;
  }

  // ─── Guides ───
  const guides = [
    {
      title: "Complete Guide to HVAC Maintenance",
      slug: "hvac-maintenance-guide",
      summary: "Everything you need to know about keeping your heating and cooling system running efficiently year-round.",
      content: "# Complete Guide to HVAC Maintenance\n\nYour HVAC system is one of the most important systems in your home. Regular maintenance can extend its lifespan by 5-10 years and reduce energy bills by up to 25%.\n\n## Monthly Tasks\n- **Check and replace air filters** — A dirty filter forces your system to work harder.\n- **Clear the area around outdoor units** — Keep at least 2 feet of clearance.\n\n## Quarterly Tasks\n- **Inspect ductwork** for visible leaks or disconnections.\n- **Test your thermostat** to ensure accurate readings.\n\n## Annual Tasks\n- **Schedule a professional tune-up** before each season.\n- **Clean evaporator and condenser coils** for efficiency.\n- **Check refrigerant levels** — low levels indicate a leak.\n\n## Warning Signs\n- Unusual noises (grinding, squealing, banging)\n- Uneven heating or cooling\n- Sudden increase in energy bills\n- Frequent cycling on and off\n- Ice forming on the outdoor unit",
      difficulty: "beginner",
      tags: "hvac,heating,cooling,air filter,energy efficiency",
      categoryId: catIds["HVAC"],
    },
    {
      title: "Water Heater Maintenance & Troubleshooting",
      slug: "water-heater-maintenance",
      summary: "Learn how to maintain your water heater, extend its life, and troubleshoot common issues.",
      content: "# Water Heater Maintenance & Troubleshooting\n\nA well-maintained water heater can last 12-15 years.\n\n## Annual Maintenance\n1. **Flush the tank** — Drain to remove sediment buildup.\n2. **Test the T&P valve** — Lift the lever to verify water flows.\n3. **Check the anode rod** — Replace if less than 1/2 inch thick.\n4. **Inspect for leaks** — Check all connections and the tank base.\n\n## Temperature Settings\n- Recommended: 120°F (49°C)\n\n## When to Replace\nConsider replacement if your water heater is over 10 years old.",
      difficulty: "intermediate",
      tags: "plumbing,water heater,maintenance,troubleshooting",
      categoryId: catIds["Plumbing"],
    },
    {
      title: "Seasonal Home Maintenance Checklist",
      slug: "seasonal-maintenance-checklist",
      summary: "A comprehensive season-by-season guide to keeping your home in top condition all year.",
      content: "# Seasonal Home Maintenance Checklist\n\n## Spring\n- Inspect roof for winter damage\n- Clean gutters and downspouts\n- Service air conditioning\n- Check exterior paint and caulking\n\n## Summer\n- Deep clean kitchen appliances\n- Check attic ventilation\n- Clean dryer vent\n- Test smoke and CO detectors\n\n## Fall\n- Service furnace / heating system\n- Clean gutters again\n- Seal gaps around windows and doors\n- Winterize outdoor faucets\n\n## Winter\n- Monitor for ice dams\n- Check pipes for freezing risk\n- Replace HVAC filters\n- Plan spring projects",
      difficulty: "beginner",
      tags: "seasonal,checklist,spring,summer,fall,winter",
      categoryId: null,
    },
    {
      title: "Kitchen Appliance Care Guide",
      slug: "kitchen-appliance-care",
      summary: "How to properly maintain your refrigerator, oven, dishwasher, and other kitchen appliances.",
      content: "# Kitchen Appliance Care Guide\n\n## Refrigerator\n- Clean condenser coils every 6 months\n- Check door gaskets regularly\n- Set temperature to 37°F (fridge) and 0°F (freezer)\n- Replace water filter every 6 months\n\n## Oven & Range\n- Clean spills promptly\n- Self-clean cycle no more than once per month\n\n## Dishwasher\n- Clean the filter monthly\n- Run a cleaning cycle with vinegar monthly\n\n## Garbage Disposal\n- Run cold water before, during, and after use\n- Clean monthly with ice cubes and salt",
      difficulty: "beginner",
      tags: "kitchen,refrigerator,oven,dishwasher,appliance care",
      categoryId: catIds["Kitchen"],
    },
    {
      title: "Finding and Hiring Reliable Home Service Professionals",
      slug: "hiring-service-professionals",
      summary: "Tips for finding, vetting, and hiring qualified contractors and home service providers.",
      content: "# Finding and Hiring Reliable Home Service Professionals\n\n## Where to Find Professionals\n1. Ask neighbors and friends\n2. Check online directories\n3. Contact your local Better Business Bureau\n\n## Vetting a Professional\n- Verify licensing\n- Confirm insurance\n- Check at least 3 references\n- Get at least 3 quotes\n\n## Red Flags\n- Demands full payment upfront\n- No physical business address\n- Won't provide references\n- Pressures you to decide immediately",
      difficulty: "beginner",
      tags: "contractors,hiring,service professionals,tips",
      categoryId: null,
    },
  ];

  for (const g of guides) {
    await prisma.guide.upsert({
      where: { slug: g.slug },
      update: {
        title: g.title,
        summary: g.summary,
        content: g.content,
        difficulty: g.difficulty,
        tags: g.tags,
        categoryId: g.categoryId,
      },
      create: g,
    });
  }

  // ─── Service Providers ───
  await prisma.serviceProvider.deleteMany();

  const providers = [
    { name: "Quick Fix Plumbing", trade: "plumber", phone: "(555) 123-4567", email: "info@quickfixplumbing.example.com", city: "Austin", state: "TX", zipCode: "78701", rating: 4.8, reviewCount: 127, description: "Licensed plumbing services. Emergency calls welcome. Specializing in water heaters, leak detection, and drain cleaning.", verified: true, categoryId: catIds["Plumbing"] },
    { name: "Comfort Zone HVAC", trade: "hvac_tech", phone: "(555) 234-5678", email: "service@comfortzonehvac.example.com", city: "Austin", state: "TX", zipCode: "78702", rating: 4.6, reviewCount: 89, description: "Full-service HVAC company. Installation, repair, and maintenance of all heating and cooling systems.", verified: true, categoryId: catIds["HVAC"] },
    { name: "BrightSpark Electrical", trade: "electrician", phone: "(555) 345-6789", email: "hello@brightspark.example.com", city: "Austin", state: "TX", zipCode: "78703", rating: 4.9, reviewCount: 203, description: "Master electricians. Panel upgrades, rewiring, lighting, and smart home installation.", verified: true, categoryId: catIds["Electrical"] },
    { name: "All-Pro Handyman Services", trade: "general_contractor", phone: "(555) 456-7890", city: "Austin", state: "TX", zipCode: "78704", rating: 4.4, reviewCount: 56, description: "General home repairs, painting, drywall, carpentry, and minor plumbing and electrical work.", verified: false },
    { name: "Premier Roofing & Gutters", trade: "roofer", phone: "(555) 567-8901", email: "estimates@premierroofing.example.com", city: "Austin", state: "TX", zipCode: "78705", rating: 4.7, reviewCount: 145, description: "Roof inspection, repair, and replacement. Gutter installation and cleaning. Free estimates.", verified: true, categoryId: catIds["Exterior"] },
  ];

  for (const p of providers) {
    await prisma.serviceProvider.create({ data: p });
  }

  console.log("Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
