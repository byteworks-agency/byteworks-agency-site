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

