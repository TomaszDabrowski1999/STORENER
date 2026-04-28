import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: "Koszulka basic",
      price: 59.99,
      description: "Wygodna koszulka",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      slug: "koszulka-basic",
    },
  });

  await prisma.product.create({
    data: {
      name: "Bluza oversize",
      price: 129.99,
      description: "Bluza na chłodne dni",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
      slug: "bluza-oversize",
    },
  });

  console.log("Seed zakończony");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("BŁĄD SEEDA:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });