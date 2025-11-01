import { InvoiceStatus, Prisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';

export function sumDecimal(values: Prisma.Decimal[]): Prisma.Decimal {
  return values.reduce((acc, v) => acc.add(v), new Prisma.Decimal(0));
}

export function computeTotals(items: { qty: Prisma.Decimal; unitPrice: Prisma.Decimal }[]) {
  const subtotal = sumDecimal(items.map((i) => i.qty.mul(i.unitPrice)));
  const taxes = new Prisma.Decimal(0); // v1: taxes handled externally or 0
  const total = subtotal.add(taxes);
  return { subtotal, taxes, total };
}

export function updateInvoiceStatusByDates(
  current: InvoiceStatus,
  balance: Prisma.Decimal,
  total: Prisma.Decimal,
  dueDate: Date,
  now = new Date()
): InvoiceStatus {
  if (current === InvoiceStatus.archived) return InvoiceStatus.archived;
  if (balance.eq(0)) return InvoiceStatus.paid;
  if (balance.gt(0) && balance.lt(total)) return InvoiceStatus.partial;
  if (now > dueDate) return InvoiceStatus.overdue;
  return current; // draft or sent remains until conditions change
}

export function isQuoteExpired(validUntil?: Date | null, now = new Date()): boolean {
  return !!validUntil && now > validUntil;
}

export async function getBillingDefaults(prisma: PrismaClient) {
  const s = await prisma.billingSettings.findFirst();
  return {
    dueDays: s?.defaultDueDays ?? 7,
    currency: s?.defaultCurrency ?? 'TTD',
  } as const;
}
