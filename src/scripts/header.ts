function lockScroll() {
  try {
    document.documentElement.style.overflow = 'hidden';
  } catch {}
}

function unlockScroll() {
  try {
    document.documentElement.style.overflow = '';
  } catch {}
}

function deriveLangFromPath(pathname: string) {
  if (pathname.startsWith('/es')) return 'es' as const;
  if (pathname.startsWith('/en')) return 'en' as const;
  return 'en' as const;
}

function normalizePath(p?: string | null) {
  if (!p) return '/';
  try { return p.replace(/\/+$/,'') || '/'; } catch { return p; }
}

function updateActiveLinks() {
  const pathname = normalizePath(window.location.pathname || '/');
  const lang = deriveLangFromPath(pathname);
  const home = lang === 'es' ? '/es' : '/en';

  const brandEl = document.getElementById('brand-link');
  if (brandEl) brandEl.setAttribute('href', home);

  const header = document.querySelector('header');
  if (!header) return;
  const anchors = header.querySelectorAll('nav a[href^="/"]');
  anchors.forEach((a) => {
    const href = a.getAttribute('href') || '';
    const h = normalizePath(href);
    const active = h === home ? (pathname === home || pathname === home + '/') : (pathname === h || pathname.startsWith(h + '/'));
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
    const inMobile = !!a.closest('#mobile-menu');
    a.classList.toggle('font-semibold', !!active);
    if (!inMobile) a.classList.toggle('underline', !!active);
  });
}

function initHeader() {
  const btn = document.getElementById('hamburger') as HTMLButtonElement | null;
  const menu = document.getElementById('mobile-menu') as HTMLElement | null;
  const overlay = document.getElementById('menu-overlay') as HTMLElement | null;
  if (!btn || !menu) return;

  if ((btn as any)._bwBound) {
    updateActiveLinks();
    return;
  }
  (btn as any)._bwBound = true;

  let keydownAttached = false;

  function openMenu() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.dataset.state = 'open';
    menu.removeAttribute('aria-hidden');
    if ('inert' in (menu as any)) (menu as any).inert = false;
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }
    lockScroll();
    const firstLink = menu.querySelector('a') as HTMLElement | null;
    if (firstLink) firstLink.focus();
    if (!keydownAttached) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
      });
      keydownAttached = true;
    }
  }

  function closeMenu() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.dataset.state = 'closed';
    menu.setAttribute('aria-hidden', 'true');
    if ('inert' in (menu as any)) (menu as any).inert = true;
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
    unlockScroll();
    btn.focus();
  }

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu(); else openMenu();
  });

  if (overlay) overlay.addEventListener('click', () => closeMenu());
  menu.addEventListener('click', (e) => {
    const t = e.target as Element | null;
    if (t && t.tagName === 'A') closeMenu();
  });

  const mql = window.matchMedia('(min-width: 768px)');
  if (mql && 'addEventListener' in mql) {
    mql.addEventListener('change', (ev) => {
      if ((ev as MediaQueryListEvent).matches) closeMenu();
    });
  }

  updateActiveLinks();

  document.addEventListener('astro:page-load', () => {
    updateActiveLinks();
    closeMenu();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}

document.addEventListener('astro:page-load', initHeader);

