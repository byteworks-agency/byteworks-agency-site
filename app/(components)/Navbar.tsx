'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function Navbar() {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const navItems = [
    { href: '/', label: dict.nav.home },
    { href: '#plans', label: dict.nav.plans },
    { href: '#addons', label: dict.nav.addons },
    { href: '#about', label: dict.nav.about },
    { href: '#contact', label: dict.nav.contact }
  ];

  return (
    <header className="border-b sticky top-0 z-40 bg-[var(--bg)]/90 backdrop-blur">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/byteworks-logo.svg" alt="ByteWorks" className="h-8 w-auto" />
            <span className="font-semibold">ByteWorks</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-slate-600 hover:text-[var(--brand)]">
              {item.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary text-sm">{dict.cta.get_started}</a>
        </nav>

        <button
          className="md:hidden btn"
          aria-label="Toggle menu"
          onClick={() => setOpen(v => !v)}
        >
          <span
            className="icon icon-md"
            style={{ ['--icon' as any]: "url('/icons/menu.svg')" }}
            aria-hidden
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-panel"
            initial={prefersReduced ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReduced ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' as any }}
            className="md:hidden border-t overflow-hidden"
          >
            <div className="container py-3 flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-600 hover:text-[var(--brand)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a href="#contact" className="btn btn-primary text-sm" onClick={() => setOpen(false)}>
                {dict.cta.get_started}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}