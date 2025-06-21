import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const regions = [
    { id: 1, name: "Western Region" },
    { id: 2, name: "Eastern Region" },
    { id: 3, name: "Northern Region" },
    { id: 4, name: "Southern Region" },
    { id: 5, name: "Central Region" },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {},
      create: {
        id: region.id,
        name: region.name,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
