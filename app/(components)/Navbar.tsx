'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function Navbar() {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReduced = useReducedMotion();

  // Enlaces que funcionan tanto en / como en páginas internas
  const navItems = [
    { href: '/', label: dict.nav.home },
    { href: '/#plans', label: dict.nav.plans },
    { href: '/#addons', label: dict.nav.addons },
    { href: '/#about', label: dict.nav.about },
    { href: '/#contact', label: dict.nav.contact },
  ];

  // Sombra al hacer scroll + evitar scroll del body con el menú abierto
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b',
        // Fondo y blur: usamos var(--bg) para respetar modo claro/oscuro
        'bg-[var(--bg)] supports-[backdrop-filter]:bg-[var(--bg)]/90',
        'backdrop-blur-md',
        isScrolled ? 'shadow-sm' : '',
      ].join(' ')}
    >
      <div className="container py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/byteworks-logo.svg" alt="ByteWorks" className="h-8 w-auto" />
            <span className="font-semibold">ByteWorks</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-600 hover:text-[var(--brand)]"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn btn-primary text-sm">
            {dict.cta.get_started}
          </Link>
        </nav>

        {/* Mobile burger (oculto en md+) */}
        <button
          className="md:hidden btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className="icon icon-md"
            style={{ ['--icon' as any]: "url('/icons/menu.svg')" }}
            aria-hidden
          />
        </button>
      </div>

      {/* Mobile panel animado */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-panel"
            initial={prefersReduced ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReduced ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' as any }}
            className="md:hidden border-t overflow-hidden bg-[var(--bg)]/95 backdrop-blur-md"
          >
            <div className="container py-3 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-600 hover:text-[var(--brand)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/#contact" className="btn btn-primary text-sm" onClick={() => setOpen(false)}>
                {dict.cta.get_started}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}