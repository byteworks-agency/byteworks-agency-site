import { z } from 'zod';

export const currencySchema = z.enum(['TTD', 'USD']).optional();

export const lineItemSchema = z.object({
  description: z.string().min(1),
  qty: z.string().regex(/^\d+(?:\.\d{1,2})?$/), // Decimal string
  unitPrice: z.string().regex(/^\d+(?:\.\d{1,2})?$/),
  sort: z.number().int().optional(),
});

export const createQuoteQuery = z.object({
  enquiryId: z.string().min(1),
});

export const createQuoteBody = z.object({
  validUntil: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  items: z.array(lineItemSchema).min(1).optional(),
  currency: currencySchema,
  billToName: z.string().max(200).optional(),
  billToEmail: z.string().email().optional(),
  billToPhone: z.string().max(50).optional(),
  customerId: z.string().max(200).optional(),
});

export const sendQuoteBody = z.object({
  quoteId: z.string().min(1),
});

export const acceptQuoteBody = z.object({
  quoteId: z.string().min(1).optional(),
  token: z.string().min(8).optional(),
});

export const declineQuoteBody = z.object({
  quoteId: z.string().min(1),
});

export const createInvoiceQuery = z.object({
  quoteId: z.string().min(1),
});

export const paymentCreateBody = z.object({
  invoiceId: z.string().min(1),
  amount: z.string().regex(/^\d+(?:\.\d{1,2})?$/),
  method: z.enum(['transfer', 'cash']),
  receivedDate: z.string().datetime(),
  ref: z.string().min(1),
  source: z.enum(['quote_deposit', 'invoice_manual']).optional(),
  proofUrl: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
});

export const remindersPreviewBody = z.object({
  invoiceId: z.string().min(1),
  template: z.enum(['due_Tminus3', 'due_day0', 'due_plus3']),
});

export const updateQuoteBody = z.object({
  quoteId: z.string().min(1),
  currency: currencySchema,
  validUntil: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  items: z.array(lineItemSchema).min(1),
  billToName: z.string().max(200).optional(),
  billToEmail: z.string().email().optional(),
  billToPhone: z.string().max(50).optional(),
});

export const updateInvoiceBody = z.object({
  invoiceId: z.string().min(1),
  currency: currencySchema,
  notes: z.string().max(2000).optional(),
  items: z.array(lineItemSchema).min(1),
  billToName: z.string().max(200).optional(),
  billToEmail: z.string().email().optional(),
  billToPhone: z.string().max(50).optional(),
});
