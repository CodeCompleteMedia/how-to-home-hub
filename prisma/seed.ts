import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  // Seed appliance categories
  const categories = [
    {
      name: "HVAC",
      icon: "thermometer",
      description:
        "Heating, ventilation, and air conditioning systems including furnaces, AC units, and heat pumps.",
    },
    {
      name: "Plumbing",
      icon: "droplets",
      description:
        "Water heaters, pipes, faucets, toilets, sump pumps, and water supply systems.",
    },
    {
      name: "Kitchen",
      icon: "chef-hat",
      description:
        "Refrigerators, ovens, dishwashers, microwaves, and other kitchen appliances.",
    },
    {
      name: "Laundry",
      icon: "shirt",
      description: "Washing machines, dryers, and laundry care systems.",
    },
    {
      name: "Electrical",
      icon: "zap",
      description:
        "Electrical panels, outlets, smoke detectors, and home wiring systems.",
    },
    {
      name: "Exterior",
      icon: "home",
      description:
        "Roof, gutters, siding, windows, doors, and outdoor structures.",
    },
    {
      name: "Water Treatment",
      icon: "glass-water",
      description:
        "Water softeners, filtration systems, and water purification.",
    },
  ];

  for (const cat of categories) {
    await prisma.applianceCategory.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  // Seed guides
  const guides = [
    {
      title: "Complete Guide to HVAC Maintenance",
      slug: "hvac-maintenance-guide",
      summary:
        "Everything you need to know about keeping your heating and cooling system running efficiently year-round.",
      content: `# Complete Guide to HVAC Maintenance

Your HVAC system is one of the most important — and expensive — systems in your home. Regular maintenance can extend its lifespan by 5-10 years and reduce energy bills by up to 25%.

## Monthly Tasks
- **Check and replace air filters** — A dirty filter forces your system to work harder, increasing energy consumption and wear.
- **Clear the area around outdoor units** — Keep at least 2 feet of clearance around your condenser unit.

## Quarterly Tasks
- **Inspect ductwork** for visible leaks or disconnections.
- **Test your thermostat** to ensure it's reading temperatures accurately.

## Annual Tasks
- **Schedule a professional tune-up** before each heating and cooling season.
- **Clean evaporator and condenser coils** to maintain heat transfer efficiency.
- **Check refrigerant levels** — low refrigerant indicates a leak that needs repair.

## Warning Signs
If you notice any of these, call a professional:
- Unusual noises (grinding, squealing, banging)
- Uneven heating or cooling between rooms
- Sudden increase in energy bills
- Frequent cycling on and off
- Ice forming on the outdoor unit

## Cost-Saving Tips
1. Install a programmable or smart thermostat
2. Seal air leaks around windows and doors
3. Add insulation to your attic and walls
4. Use ceiling fans to assist air circulation`,
      difficulty: "beginner",
      tags: "hvac,heating,cooling,air filter,energy efficiency",
      categoryName: "HVAC",
    },
    {
      title: "Water Heater Maintenance & Troubleshooting",
      slug: "water-heater-maintenance",
      summary:
        "Learn how to maintain your water heater, extend its life, and troubleshoot common issues.",
      content: `# Water Heater Maintenance & Troubleshooting

A well-maintained water heater can last 12-15 years. Neglected units often fail in 6-8 years.

## Annual Maintenance
1. **Flush the tank** — Connect a garden hose to the drain valve. Open it and let water flow until it runs clear. This removes sediment buildup.
2. **Test the T&P valve** — Lift the lever on the temperature and pressure relief valve. Water should flow freely. If not, replace the valve.
3. **Check the anode rod** — Unscrew the anode rod from the top. If it's less than 1/2 inch thick or coated with calcium, replace it.
4. **Inspect for leaks** — Check all connections, the base of the tank, and the T&P discharge pipe.

## Temperature Settings
- Recommended: 120°F (49°C)
- Higher temps waste energy and risk scalding
- Lower temps may allow bacterial growth

## Troubleshooting
| Problem | Possible Cause | Solution |
|---------|---------------|----------|
| No hot water | Pilot light out / heating element failed | Relight pilot or replace element |
| Not enough hot water | Sediment buildup / thermostat issue | Flush tank / adjust thermostat |
| Rusty water | Failing anode rod | Replace anode rod |
| Strange noises | Sediment buildup | Flush the tank |
| Leaking | Failed valve or corroded tank | Replace valve or entire unit |

## When to Replace
Consider replacement if your water heater is over 10 years old, requires frequent repairs, or shows signs of rust at the base.`,
      difficulty: "intermediate",
      tags: "plumbing,water heater,maintenance,troubleshooting",
      categoryName: "Plumbing",
    },
    {
      title: "Seasonal Home Maintenance Checklist",
      slug: "seasonal-maintenance-checklist",
      summary:
        "A comprehensive season-by-season guide to keeping your home in top condition all year.",
      content: `# Seasonal Home Maintenance Checklist

Staying on top of seasonal maintenance prevents costly emergency repairs and protects your home's value.

## Spring
- [ ] Inspect roof for winter damage
- [ ] Clean gutters and downspouts
- [ ] Service air conditioning before summer
- [ ] Check exterior paint and caulking
- [ ] Test outdoor faucets and sprinkler systems
- [ ] Power wash deck, patio, and siding
- [ ] Inspect foundation for cracks

## Summer
- [ ] Deep clean kitchen appliances
- [ ] Check attic ventilation and insulation
- [ ] Inspect and repair window screens
- [ ] Maintain lawn equipment
- [ ] Clean dryer vent
- [ ] Test smoke and CO detectors
- [ ] Inspect plumbing for leaks

## Fall
- [ ] Service furnace / heating system
- [ ] Clean and store outdoor furniture
- [ ] Rake leaves and clean gutters (again)
- [ ] Disconnect garden hoses and winterize outdoor faucets
- [ ] Seal gaps around windows and doors
- [ ] Stock up on winter supplies (salt, shovels)
- [ ] Test backup generator if applicable

## Winter
- [ ] Monitor for ice dams on the roof
- [ ] Check pipes in unheated areas for freezing risk
- [ ] Replace HVAC filters
- [ ] Test sump pump
- [ ] Inspect weather stripping on exterior doors
- [ ] Reverse ceiling fan direction (clockwise on low)
- [ ] Plan spring projects and get contractor quotes`,
      difficulty: "beginner",
      tags: "seasonal,checklist,spring,summer,fall,winter,comprehensive",
      categoryName: null,
    },
    {
      title: "Kitchen Appliance Care Guide",
      slug: "kitchen-appliance-care",
      summary:
        "How to properly maintain your refrigerator, oven, dishwasher, and other kitchen appliances.",
      content: `# Kitchen Appliance Care Guide

Kitchen appliances represent a significant investment. Proper care keeps them running efficiently and extends their usable life.

## Refrigerator
- **Clean condenser coils** every 6 months (underneath or behind the unit)
- **Check door gaskets** — close a dollar bill in the door; if it slides out easily, replace the gasket
- **Set temperature** to 37°F (fridge) and 0°F (freezer)
- **Replace water filter** every 6 months
- **Defrost** if ice buildup exceeds 1/4 inch (manual defrost models)

## Oven & Range
- **Clean spills promptly** to prevent baked-on residue
- **Self-clean cycle**: Run no more than once per month, and never before a holiday (it can blow a fuse)
- **Check burner igniters** and clean ports with a pin if flames are uneven
- **Inspect the door gasket** for tears or gaps

## Dishwasher
- **Clean the filter** monthly — it's usually at the bottom of the tub
- **Run a cleaning cycle** with dishwasher cleaner or vinegar monthly
- **Inspect spray arms** for clogs and clear with a toothpick
- **Check the door latch and gasket** for proper sealing

## Microwave
- **Clean interior** with a bowl of water and lemon, microwaved for 3 minutes
- **Check door seal** for damage
- **Never run empty** — it can damage the magnetron

## Garbage Disposal
- **Run cold water** before, during, and after use
- **Clean monthly** with ice cubes and salt
- **Never put** grease, fibrous foods, or bones down the disposal`,
      difficulty: "beginner",
      tags: "kitchen,refrigerator,oven,dishwasher,microwave,appliance care",
      categoryName: "Kitchen",
    },
    {
      title: "Finding and Hiring Reliable Home Service Professionals",
      slug: "hiring-service-professionals",
      summary:
        "Tips for finding, vetting, and hiring qualified contractors, plumbers, electricians, and other home service providers.",
      content: `# Finding and Hiring Reliable Home Service Professionals

Hiring the right professional can save you money and headaches. Here's how to find trustworthy help.

## Where to Find Professionals
1. **Ask neighbors and friends** — word of mouth is often the most reliable source
2. **Check online directories** and review sites
3. **Contact your local Better Business Bureau**
4. **Ask at your local hardware store** — staff often know reputable contractors

## Vetting a Professional
Before hiring, always:
- **Verify licensing** — check with your state's licensing board
- **Confirm insurance** — ask for certificates of liability and workers' comp
- **Check references** — call at least 3 previous clients
- **Read reviews** — look for patterns, not just individual ratings
- **Get multiple quotes** — at least 3 for any major work

## Red Flags
- Demands full payment upfront
- No physical business address
- Won't provide references
- Pressures you to decide immediately
- Offers prices far below competitors
- No written contract or estimate

## Working with Contractors
- **Get everything in writing** — scope of work, timeline, materials, and payment schedule
- **Payment schedule** — typically 10-30% deposit, progress payments, final payment on completion
- **Keep communication documented** — email or text confirmations for changes
- **Inspect work regularly** during the project

## Emergency Situations
Keep a list of trusted professionals for emergencies:
- 24/7 plumber
- Emergency electrician
- HVAC emergency service
- Water damage restoration
- Locksmith`,
      difficulty: "beginner",
      tags: "contractors,hiring,service professionals,tips,vetting",
      categoryName: null,
    },
  ];

  for (const guide of guides) {
    const { categoryName, ...guideData } = guide;
    let categoryId: string | null = null;
    if (categoryName) {
      const cat = await prisma.applianceCategory.findUnique({
        where: { name: categoryName },
      });
      categoryId = cat?.id ?? null;
    }
    await prisma.guide.upsert({
      where: { slug: guideData.slug },
      update: { ...guideData, categoryId },
      create: { ...guideData, categoryId },
    });
  }

  // Seed some sample service providers
  const providers = [
    {
      name: "Quick Fix Plumbing",
      trade: "plumber",
      phone: "(555) 123-4567",
      email: "info@quickfixplumbing.example.com",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      rating: 4.8,
      reviewCount: 127,
      description:
        "Licensed and insured plumbing services. Emergency calls welcome. Specializing in water heaters, leak detection, and drain cleaning.",
      verified: true,
      categoryName: "Plumbing",
    },
    {
      name: "Comfort Zone HVAC",
      trade: "hvac_tech",
      phone: "(555) 234-5678",
      email: "service@comfortzonehvac.example.com",
      city: "Austin",
      state: "TX",
      zipCode: "78702",
      rating: 4.6,
      reviewCount: 89,
      description:
        "Full-service HVAC company. Installation, repair, and maintenance of all heating and cooling systems.",
      verified: true,
      categoryName: "HVAC",
    },
    {
      name: "BrightSpark Electrical",
      trade: "electrician",
      phone: "(555) 345-6789",
      email: "hello@brightspark.example.com",
      city: "Austin",
      state: "TX",
      zipCode: "78703",
      rating: 4.9,
      reviewCount: 203,
      description:
        "Master electricians serving residential and commercial clients. Panel upgrades, rewiring, lighting, and smart home installation.",
      verified: true,
      categoryName: "Electrical",
    },
    {
      name: "All-Pro Handyman Services",
      trade: "general_contractor",
      phone: "(555) 456-7890",
      city: "Austin",
      state: "TX",
      zipCode: "78704",
      rating: 4.4,
      reviewCount: 56,
      description:
        "General home repairs, painting, drywall, carpentry, and minor plumbing and electrical work.",
      verified: false,
      categoryName: null,
    },
    {
      name: "Premier Roofing & Gutters",
      trade: "roofer",
      phone: "(555) 567-8901",
      email: "estimates@premierroofing.example.com",
      city: "Austin",
      state: "TX",
      zipCode: "78705",
      rating: 4.7,
      reviewCount: 145,
      description:
        "Roof inspection, repair, and replacement. Gutter installation and cleaning. Free estimates.",
      verified: true,
      categoryName: "Exterior",
    },
  ];

  for (const provider of providers) {
    const { categoryName, ...providerData } = provider;
    let categoryId: string | null = null;
    if (categoryName) {
      const cat = await prisma.applianceCategory.findUnique({
        where: { name: categoryName },
      });
      categoryId = cat?.id ?? null;
    }
    await prisma.serviceProvider.create({
      data: { ...providerData, categoryId },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
