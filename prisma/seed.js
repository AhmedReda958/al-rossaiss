import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const regions = [
    { id: 1, name: "Western Region", key: "western" },
    { id: 2, name: "Eastern Region", key: "eastern" },
    { id: 5, name: "Central Region", key: "central" },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {
        name: region.name,
        key: region.key,
      },
      create: {
        id: region.id,
        name: region.name,
        key: region.key,
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
