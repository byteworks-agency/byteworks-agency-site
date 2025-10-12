// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

const isAsset = (p: string) =>
  p.startsWith('/_astro') ||
  p.startsWith('/assets') ||
  p.startsWith('/api') ||
  p.startsWith('/favicon') ||
  /\.(ico|png|jpg|jpeg|svg|webp|css|js|map|txt|xml)$/i.test(p);

export const onRequest: MiddlewareHandler = (context, next) => {
  const url = new URL(context.request.url);
  const { pathname, searchParams } = url;

  // Si ya estamos en /en o /es, o es un asset, seguimos normal
  if (/^\/(en|es)(\/|$)/.test(pathname) || isAsset(pathname)) {
    return next();
  }

  // 1) override por query ?lang=en|es
  const qlang = searchParams.get('lang');
  if (qlang === 'en' || qlang === 'es') {
    context.cookies.set('bw_lang', qlang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return Response.redirect(new URL(`/${qlang}/`, url), 302);
  }

  // 2) cookie previa
  const cookieLang = context.cookies.get('bw_lang')?.value;
  if (cookieLang === 'en' || cookieLang === 'es') {
    return Response.redirect(new URL(`/${cookieLang}/`, url), 302);
  }

  // 3) Accept-Language del dispositivo
  const accept = (context.request.headers.get('accept-language') || '').toLowerCase();
  const guess = accept.startsWith('es') ? 'es' : 'en';

  context.cookies.set('bw_lang', guess, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  return Response.redirect(new URL(`/${guess}/`, url), 302);
};