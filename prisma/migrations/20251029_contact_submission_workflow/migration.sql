-- Ensure pgcrypto for UUID defaults (safe on Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure enums exist (idempotent)
DO $$ BEGIN
  CREATE TYPE "ContactPreference" AS ENUM ('whatsapp','email');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "LeadStatus" AS ENUM ('new','quoting','converted','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create ContactSubmission table if it does not exist yet
CREATE TABLE IF NOT EXISTS "ContactSubmission" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "message" text NOT NULL,
  "preference" "ContactPreference" NOT NULL DEFAULT 'whatsapp',
  "lang" text,
  "sourceUrl" text,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- Add workflow fields (idempotent)
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "archived" boolean NOT NULL DEFAULT false;
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "status" "LeadStatus" NOT NULL DEFAULT 'new';
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp with time zone NOT NULL DEFAULT now();

