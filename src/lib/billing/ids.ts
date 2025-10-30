import { randomBytes } from 'crypto';

export function generateAcceptToken(): string {
  return randomBytes(16).toString('hex');
}

export function invoiceNumberPrefix(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `INV-${y}${m}`;
}

export function formatInvoiceNumber(prefix: string, seq: number): string {
  return `${prefix}-${String(seq).padStart(4, '0')}`;
}

// Company-facing unified reference helpers
const PUBLIC_COMPANY_CODE = import.meta.env.PUBLIC_COMPANY_CODE as string | undefined;
export function getCompanyCode(): string {
  // Only use the PUBLIC_ var; default to 'BW' if not set
  const code = PUBLIC_COMPANY_CODE || 'BW';
  return String(code || 'BW').toUpperCase();
}

export function companyRefPrefix(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${getCompanyCode()}-${y}${m}`;
}

export function companyRefFromSeed(date: Date, seed: string): string {
  const prefix = companyRefPrefix(date);
  const clean = (seed || '').replace(/[^A-Za-z0-9]/g, '');
  const suffix = (clean.slice(0, 6) || '000000').toUpperCase();
  return `${prefix}-${suffix}`;
}
