import { prisma } from "./prisma";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
  try {
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.revenue.findMany();

    console.log("Data fetch completed after 3 seconds.");
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        amount: true,
        customer: {
          select: { name: true, image_url: true, email: true },
        },
      },
      orderBy: { date: "desc" },
      take: 5,
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer.name,
      image_url: invoice.customer.image_url,
      email: invoice.customer.email,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    const [numberOfInvoices, numberOfCustomers, invoiceStatus] =
      await Promise.all([
        prisma.invoice.count(),
        prisma.customer.count(),
        prisma.invoice.groupBy({
          by: ["status"],
          _sum: { amount: true },
        }),
      ]);

    const paid =
      invoiceStatus.find((s) => s.status === "paid")?._sum.amount ?? 0;
    const pending =
      invoiceStatus.find((s) => s.status === "pending")?._sum.amount ?? 0;

    return {
      numberOfInvoices,
      numberOfCustomers,
      totalPaidInvoices: formatCurrency(paid),
      totalPendingInvoices: formatCurrency(pending),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: "insensitive" } } },
          { customer: { email: { contains: query, mode: "insensitive" } } },
          { status: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer_id: true,
        customer: {
          select: { name: true, email: true, image_url: true },
        },
      },
      orderBy: { date: "desc" },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      customer_id: invoice.customer_id,
      name: invoice.customer.name,
      email: invoice.customer.email,
      image_url: invoice.customer.image_url,
      date: invoice.date.toISOString().split("T")[0],
      amount: invoice.amount,
      status: invoice.status as "pending" | "paid",
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoice.count({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: "insensitive" } } },
          { customer: { email: { contains: query, mode: "insensitive" } } },
          { status: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
      },
    });

    if (!invoice) return undefined;

    return {
      ...invoice,
      amount: invoice.amount / 100,
      status: invoice.status as "pending" | "paid",
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    return await prisma.customer.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
        invoices: {
          select: { amount: true, status: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return customers.map((customer) => {
      const total_invoices = customer.invoices.length;
      const total_pending = customer.invoices
        .filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + inv.amount, 0);
      const total_paid = customer.invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      };
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customer table.");
  }
}
