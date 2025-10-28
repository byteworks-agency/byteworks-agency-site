type Dict = Record<string, string>;

const EN: Dict = {
  'enquiries.actions.generateQuote': 'Generate quote',
  'quotes.status.draft': 'Draft',
  'quotes.status.sent': 'Sent',
  'quotes.status.accepted': 'Accepted',
  'quotes.status.declined': 'Declined',
  'quotes.status.expired': 'Expired',
  'quotes.labels.total': 'Total',
  'quotes.labels.validUntil': 'Valid Until',
  'quotes.labels.terms': 'Terms',
  'quotes.labels.items': 'Items',
  'quotes.messages.created_from_enquiry': 'Quote created from enquiry {id}.',
  'quotes.actions.send': 'Send',
  'quotes.actions.accept': 'Accept',
  'quotes.actions.decline': 'Decline',
  'quotes.actions.convertToInvoice': 'Convert to Invoice',
  'billing.status.draft': 'Draft',
  'billing.status.sent': 'Sent',
  'billing.status.partial': 'Partial',
  'billing.status.paid': 'Paid',
  'billing.status.overdue': 'Overdue',
  'billing.status.void': 'Void',
  'billing.labels.total': 'Total',
  'billing.labels.paid': 'Paid',
  'billing.labels.balance': 'Balance',
  'billing.labels.issueDate': 'Issue Date',
  'billing.labels.dueDate': 'Due Date',
  'billing.labels.currency': 'Currency',
  'billing.actions.generateInvoice': 'Generate invoice',
  'billing.payment.recorded_deposit': 'Deposit recorded: {amount}.',
  'billing.errors.amount_exceeds_balance': 'Amount exceeds remaining balance.',
  'billing.errors.idempotent_conflict': 'A payment with this reference already exists for this invoice.',
};

const ES: Dict = {
  'enquiries.actions.generateQuote': 'Generar cotización',
  'quotes.status.draft': 'Borrador',
  'quotes.status.sent': 'Enviada',
  'quotes.status.accepted': 'Aceptada',
  'quotes.status.declined': 'Rechazada',
  'quotes.status.expired': 'Vencida',
  'quotes.labels.total': 'Total',
  'quotes.labels.validUntil': 'Válida hasta',
  'quotes.labels.terms': 'Términos',
  'quotes.labels.items': 'Ítems',
  'quotes.messages.created_from_enquiry': 'Cotización creada desde solicitud {id}.',
  'quotes.actions.send': 'Enviar',
  'quotes.actions.accept': 'Aceptar',
  'quotes.actions.decline': 'Rechazar',
  'quotes.actions.convertToInvoice': 'Convertir a factura',
  'billing.status.draft': 'Borrador',
  'billing.status.sent': 'Enviada',
  'billing.status.partial': 'Parcial',
  'billing.status.paid': 'Pagada',
  'billing.status.overdue': 'Vencida',
  'billing.status.void': 'Anulada',
  'billing.labels.total': 'Total',
  'billing.labels.paid': 'Pagado',
  'billing.labels.balance': 'Saldo',
  'billing.labels.issueDate': 'Fecha de emisión',
  'billing.labels.dueDate': 'Fecha de vencimiento',
  'billing.labels.currency': 'Moneda',
  'billing.actions.generateInvoice': 'Generar factura',
  'billing.payment.recorded_deposit': 'Abono registrado: {amount}.',
  'billing.errors.amount_exceeds_balance': 'El importe excede el saldo restante.',
  'billing.errors.idempotent_conflict': 'Ya existe un pago con esta referencia para la factura.',
};

export type Lang = 'en' | 'es';
export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const dict = lang === 'es' ? ES : EN;
  let str = dict[key] || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, String(v));
  }
  return str;
}

