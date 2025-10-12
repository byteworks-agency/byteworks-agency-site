export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Client as Notion } from '@notionhq/client';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);
const notion = new Notion({ auth: process.env.NOTION_TOKEN });

// Validación del payload
const Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  projectType: z.enum(['Website', 'E-commerce', 'Automation', 'Custom']),
  message: z.string().min(10).max(2000),
  lang: z.enum(['en', 'es']).default('en'),
});

// Rate limit simple en memoria
const BUCKET = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
function rateLimit(ip: string) {
  const now = Date.now();
  const hits = (BUCKET.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  BUCKET.set(ip, hits);
  return hits.length <= LIMIT;
}

export async function POST(req: Request) {
  try {
    const ip =
      (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() ||
      '0.0.0.0';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid data' },
        { status: 400 }
      );
    }

    const { name, email, projectType, message, lang } = parsed.data;

    // --- Notion: solo metadatos, SIN mensaje ---
    const dbId = process.env.NOTION_DATABASE_ID;
    if (!dbId) throw new Error('Missing NOTION_DATABASE_ID');

    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email },
        'Project Type': { select: { name: projectType } },
        Language: { select: { name: lang.toUpperCase() } },
        Source: { select: { name: 'Website Form' } },
        Status: { select: { name: 'New' } },
        'Created At': { date: { start: new Date().toISOString() } },
      },
      // sin children: el mensaje NO queda guardado en Notion
    });

    // --- Email: interno + auto-reply ---
    const FROM =
      process.env.CONTACT_FROM || 'ByteWorks <onboarding@resend.dev>';

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_MISCONFIG: Missing RESEND_API_KEY');
    }

    if (!process.env.CONTACT_TO) {
      console.error('RESEND_MISCONFIG: Missing CONTACT_TO');
    }

    const subject =
      lang === 'es' ? 'Nuevo mensaje — ByteWorks' : 'New message — ByteWorks';

    // Correo interno (a ti)
    try {
      if (!process.env.CONTACT_TO) throw new Error('Missing CONTACT_TO');
      await resend.emails.send({
        from: FROM,
        to: process.env.CONTACT_TO,
        subject,
        text: `Name: ${name}
Email: ${email}
Project: ${projectType}
Lang: ${lang}
Message:
${message}

IP: ${ip}`,
      });
    } catch (e: any) {
      console.error('RESEND_INTERNAL_ERROR', e?.message || e);
      // Continuamos aunque falle el correo interno (ya guardamos en Notion)
    }

    // Auto-reply (opcional)
    if (process.env.AUTO_REPLY_ENABLED === 'true') {
      const replySubject =
        lang === 'es'
          ? 'Hemos recibido tu mensaje — ByteWorks'
          : 'We received your message — ByteWorks';
      const replyText =
        lang === 'es'
          ? `Hola ${name},\n\nGracias por escribirnos. Recibimos tu consulta y te responderemos en 24–48h.\n\n— Equipo ByteWorks`
          : `Hi ${name},\n\nThanks for reaching out. We received your message and will reply within 24–48h.\n\n— ByteWorks Team`;

      try {
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: replySubject,
          text: replyText,
        });
      } catch (e: any) {
        console.error('RESEND_AUTOREPLY_ERROR', e?.message || e);
        // No interrumpimos el flujo si falla el auto-reply
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('CONTACT_ERROR', err);
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 }
    );
  }
}