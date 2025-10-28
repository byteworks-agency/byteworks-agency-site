ALTER TABLE "Quote" ADD COLUMN "billToName" text;
ALTER TABLE "Quote" ADD COLUMN "billToEmail" text;
ALTER TABLE "Quote" ADD COLUMN "billToPhone" text;

ALTER TABLE "Invoice" ADD COLUMN "billToName" text;
ALTER TABLE "Invoice" ADD COLUMN "billToEmail" text;
ALTER TABLE "Invoice" ADD COLUMN "billToPhone" text;

