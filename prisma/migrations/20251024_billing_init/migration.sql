-- Minimal SQL compatible with Postgres (Supabase)
-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE "Currency" AS ENUM ('TTD','USD');
CREATE TYPE "QuoteStatus" AS ENUM ('draft','sent','accepted','declined','expired');
CREATE TYPE "InvoiceStatus" AS ENUM ('draft','sent','partial','paid','overdue','void');
CREATE TYPE "PaymentMethod" AS ENUM ('transfer','cash');

CREATE TABLE "BillingSettings" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "defaultDueDays" integer,
  "defaultCurrency" "Currency",
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "Quote" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "customerId" text NOT NULL,
  "status" "QuoteStatus" NOT NULL DEFAULT 'draft',
  "currency" "Currency" NOT NULL DEFAULT 'TTD',
  "subtotal" numeric(10,2) NOT NULL,
  "taxes" numeric(10,2) NOT NULL,
  "total" numeric(10,2) NOT NULL,
  "validUntil" timestamp with time zone,
  "notes" text,
  "originEnquiryId" text,
  "acceptToken" text UNIQUE,
  "sentAt" timestamp with time zone,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "Quote_originEnquiryId_idx" ON "Quote"("originEnquiryId");

CREATE TABLE "QuoteItem" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "quoteId" text NOT NULL REFERENCES "Quote"("id") ON DELETE CASCADE,
  "description" text NOT NULL,
  "qty" numeric(10,2) NOT NULL,
  "unitPrice" numeric(10,2) NOT NULL,
  "sort" integer
);

CREATE TABLE "Invoice" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "customerId" text NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'draft',
  "currency" "Currency" NOT NULL DEFAULT 'TTD',
  "subtotal" numeric(10,2) NOT NULL,
  "taxes" numeric(10,2) NOT NULL,
  "total" numeric(10,2) NOT NULL,
  "balance" numeric(10,2) NOT NULL,
  "issueDate" timestamp with time zone NOT NULL,
  "dueDate" timestamp with time zone NOT NULL,
  "notes" text,
  "originQuoteId" text,
  "number" text UNIQUE,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX "Invoice_originQuoteId_idx" ON "Invoice"("originQuoteId");

CREATE TABLE "InvoiceItem" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "invoiceId" text NOT NULL REFERENCES "Invoice"("id") ON DELETE CASCADE,
  "description" text NOT NULL,
  "qty" numeric(10,2) NOT NULL,
  "unitPrice" numeric(10,2) NOT NULL,
  "sort" integer
);

CREATE TABLE "Payment" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "invoiceId" text NOT NULL REFERENCES "Invoice"("id") ON DELETE CASCADE,
  "method" "PaymentMethod" NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "receivedDate" timestamp with time zone NOT NULL,
  "ref" text NOT NULL,
  "source" text,
  "proofUrl" text,
  "notes" text,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "Payment_invoice_ref_unique" ON "Payment"("invoiceId","ref");
CREATE INDEX "Payment_receivedDate_idx" ON "Payment"("receivedDate");
