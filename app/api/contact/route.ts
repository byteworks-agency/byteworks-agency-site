import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().optional(),
  message: z.string().min(10).max(2000),
  locale: z.enum(["en", "es"]).optional(),
});

const WINDOW_MS = 60_000;
const MAX_REQS = 5;
const ipHits = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const ip = fwd.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const hits = ipHits.get(ip)?.filter((ts) => ts > windowStart) ?? [];
  hits.push(now);
  ipHits.set(ip, hits);
  return hits.length <= MAX_REQS;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests, try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, message, locale } = parsed.data;

    const SEND_METHOD = process.env.CONTACT_METHOD ?? "resend"; // "resend" | "console"
    const TO = process.env.CONTACT_TO ?? "macrodriguez2512@gmail.com";
    const FROM = process.env.CONTACT_FROM ?? "ByteWorks <no-reply@byteworks.agency>";

    if (SEND_METHOD === "resend") {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { ok: false, error: "Missing RESEND_API_KEY" },
          { status: 500 }
        );
      }

      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      const subject = locale === "es" ? `Nuevo contacto — ${name}` : `New contact — ${name}`;
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto; line-height:1.5;">
          <h2>${escapeHtml(subject)}</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>
          <hr/><small>IP: ${escapeHtml(ip)}</small>
        </div>
      `;

      const { data: resData, error } = await resend.emails.send({
        from: FROM,
        to: [TO],
        subject,
        html,
      });

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message ?? "Email send error" },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true, id: resData?.id }, { status: 200 });
    }

    // Modo consola
    console.log("[CONTACT]", { name, email, phone, message, ip });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";