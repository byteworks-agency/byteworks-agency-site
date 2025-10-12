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
  const accept = (context.request.headers.get('accept-language') || '').toLowerCase();
  const guess = accept.startsWith('es') ? 'es' : 'en';
  context.cookies.set('bw_lang', guess, { path: '/', maxAge: 31536000 });

  return new Response(null, {
    status: 307,
    headers: { Location: `/${guess}/` },
  });
};