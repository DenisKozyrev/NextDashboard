import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  users,
  customers,
  invoices,
  revenue,
} from "../app/lib/placeholder-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
  }
  console.log(`Seeded ${users.length} users`);

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
      },
    });
  }
  console.log(`Seeded ${customers.length} customers`);

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: {
        customer_id: invoice.customer_id,
        amount: invoice.amount,
        status: invoice.status,
        date: new Date(invoice.date),
      },
    });
  }
  console.log(`Seeded ${invoices.length} invoices`);

  for (const rev of revenue) {
    await prisma.revenue.upsert({
      where: { month: rev.month },
      update: { revenue: rev.revenue },
      create: {
        month: rev.month,
        revenue: rev.revenue,
      },
    });
  }
  console.log(`Seeded ${revenue.length} revenue records`);

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
