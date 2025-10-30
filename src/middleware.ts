import type { MiddlewareHandler } from 'astro';
import { getSupabaseUserFromCookies } from './lib/supabase';
const env = import.meta.env;

const isAsset = (p: string) =>
  p.startsWith('/_astro') ||
  p.startsWith('/assets') ||
  p.startsWith('/api') ||
  p.startsWith('/favicon') ||
  /\.(ico|png|jpg|jpeg|svg|webp|css|js|map|txt|xml)$/i.test(p);

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const { pathname, searchParams } = url;

  // Allow auth routes to render (no locale redirect)
  if (/^\/auth(\/|$)/.test(pathname)) {
    return next();
  }

  if (/^\/admin(\/|$)/.test(pathname)) {
    // Prefer Supabase Auth session if available and email is allowed
    const supaUser = await getSupabaseUserFromCookies(context.cookies);
    const ALLOWED = env.ADMIN_EMAIL as string | undefined;
    if (supaUser && (!ALLOWED || (supaUser.email?.toLowerCase?.() === ALLOWED.toLowerCase()))) {
      return next();
    }

    // Fallback simple gate with ADMIN_SECRET (development only)
    if (!env.PROD) {
      const ADMIN_SECRET = env.ADMIN_SECRET as string | undefined;
      if (!ADMIN_SECRET) {
        return new Response(null, { status: 307, headers: { Location: '/auth/signin' } });
      }
      const cookie = context.cookies.get('admin_session')?.value;
      if (cookie !== ADMIN_SECRET) {
        return new Response(null, { status: 307, headers: { Location: '/auth/signin' } });
      }
      return next();
    }
    return new Response(null, { status: 307, headers: { Location: '/auth/signin' } });
  }

  if (/^\/(en|es)(\/|$)/.test(pathname) || isAsset(pathname)) {
    return next(); // ya estamos en idioma o es asset
  }

  // override manual: /?lang=en|es
  const qlang = searchParams.get('lang');
  if (qlang === 'en' || qlang === 'es') {
    context.cookies.set('bw_lang', qlang, { path: '/', maxAge: 31536000 });
    return new Response(null, {
      status: 307,
      headers: { Location: `/${qlang}/` },
    });
  }

  // cookie guardada
  const cookieLang = context.cookies.get('bw_lang')?.value;
  if (cookieLang === 'en' || cookieLang === 'es') {
    return new Response(null, {
      status: 307,
      headers: { Location: `/${cookieLang}/` },
    });
  }

  // idioma del navegador
  const accept = context.request.headers.get('accept-language') || '';

  const parseAcceptLanguage = (header: string, supported: string[], fallback: string) => {
    const cleaned = header.trim();
    if (!cleaned) return fallback;

    const entries = cleaned
      .split(',')
      .map((raw, index) => {
        const [range, ...params] = raw.trim().split(';');
        let weight = 1;

        for (const param of params) {
          const [key, value] = param.split('=').map((part) => part?.trim().toLowerCase());
          if (key === 'q' && value) {
            const parsed = Number.parseFloat(value);
            if (!Number.isNaN(parsed)) {
              weight = Math.min(Math.max(parsed, 0), 1);
            }
          }
        }

        return { range: range.toLowerCase(), weight, index };
      })
      .filter((entry) => Boolean(entry.range))
      .sort((a, b) => {
        if (b.weight === a.weight) return a.index - b.index;
        return b.weight - a.weight;
      });

    for (const { range } of entries) {
      if (supported.includes(range)) return range;

      const base = range.split('-')[0];
      if (supported.includes(base)) return base;
    }

    return fallback;
  };

  const guess = parseAcceptLanguage(accept, ['en', 'es'], 'en');
  context.cookies.set('bw_lang', guess, { path: '/', maxAge: 31536000 });

  return new Response(null, {
    status: 307,
    headers: { Location: `/${guess}/` },
  });
};
