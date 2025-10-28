import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed BillingSettings with defaults if none exist
  const existing = await prisma.billingSettings.findFirst()
  if (!existing) {
    await prisma.billingSettings.create({
      data: {
        defaultDueDays: 7,
        defaultCurrency: 'TTD',
      },
    })
    console.log('Seeded BillingSettings with defaultDueDays=7, defaultCurrency=TTD')
  } else {
    console.log('BillingSettings already present. Skipping.')
  }

  // Demo data: one draft quote and one accepted quote + invoice + payment
  const qCount = await prisma.quote.count()
  if (qCount === 0) {
    const q1 = await prisma.quote.create({
      data: {
        customerId: 'from_enquiry_DEMO-001',
        status: 'draft',
        currency: 'TTD',
        billToName: 'Demo Customer',
        billToEmail: 'demo@example.com',
        subtotal: '100.00',
        taxes: '0.00',
        total: '100.00',
        originEnquiryId: 'DEMO-001',
        items: { create: [{ description: 'Landing Page', qty: '1.00', unitPrice: '100.00', sort: 1 }] },
      },
      select: { id: true }
    })
    console.log('Created draft quote', q1.id)

    const q2 = await prisma.quote.create({
      data: {
        customerId: 'from_enquiry_DEMO-002',
        status: 'accepted',
        currency: 'USD',
        billToName: 'Acme Ltd.',
        billToEmail: 'ap@acme.test',
        subtotal: '250.00',
        taxes: '0.00',
        total: '250.00',
        originEnquiryId: 'DEMO-002',
        items: { create: [
          { description: 'Multi-page Site', qty: '1.00', unitPrice: '200.00', sort: 1 },
          { description: 'SEO Setup', qty: '1.00', unitPrice: '50.00', sort: 2 },
        ] },
      },
      include: { items: true }
    })

    const inv = await prisma.invoice.create({
      data: {
        customerId: q2.customerId,
        status: 'partial',
        currency: q2.currency,
        billToName: q2.billToName,
        billToEmail: q2.billToEmail,
        subtotal: q2.subtotal,
        taxes: q2.taxes,
        total: q2.total,
        balance: '200.00',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7*24*60*60*1000),
        notes: `From Quote ${q2.id}`,
        originQuoteId: q2.id,
        items: { create: q2.items.map((i, idx) => ({ description: i.description, qty: i.qty, unitPrice: i.unitPrice, sort: idx+1 })) },
        payments: { create: [{ amount: '50.00', method: 'transfer', receivedDate: new Date(), ref: 'DEMO-DEP-1', source: 'quote_deposit' }] },
      },
      select: { id: true }
    })
    console.log('Created invoice', inv.id)
  } else {
    console.log('Quotes already present. Skipping demo data.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
