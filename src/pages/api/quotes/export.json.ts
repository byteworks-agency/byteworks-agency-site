import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const auth = await requireRole(cookies, ['admin', 'staff']);
  if (!auth.ok) return new Response('forbidden', { status: 403 });

  const status = (url.searchParams.get('status') || 'all');
  const q = (url.searchParams.get('q') || '').trim();
  const where: any = {};
  if (status && status !== 'all') where.status = status as any;
  if (q) {
    where.OR = [
      { id: { contains: q, mode: 'insensitive' as any } },
      { billToName: { contains: q, mode: 'insensitive' as any } },
      { customerId: { contains: q, mode: 'insensitive' as any } },
    ];
  }

  const rows = await prisma.quote.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { items: true },
  });
  const data = rows.map((r) => ({
    ...r,
    subtotal: r.subtotal.toString(),
    taxes: r.taxes.toString(),
    total: r.total.toString(),
    items: r.items
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
      .map((i) => ({ ...i, qty: i.qty.toString(), unitPrice: i.unitPrice.toString() })),
  }));
  return new Response(JSON.stringify({ ok: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
