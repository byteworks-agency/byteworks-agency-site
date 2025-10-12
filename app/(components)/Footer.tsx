'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { dict } = useI18n();

  const links = [
    { href: '/', label: dict.nav.home },
    { href: '/#plans', label: dict.nav.plans },
    { href: '/#addons', label: dict.nav.addons },
    { href: '/#about', label: dict.nav.about },
    { href: '/#contact', label: dict.nav.contact },
  ];

  return (
    <footer className="border-t mt-10">
      <div className="container py-10 grid md:grid-cols-3 gap-8">
        {/* Brand / Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img src="/byteworks-logo.svg" alt="ByteWorks" className="h-7 w-auto" />
            <span className="font-semibold">ByteWorks</span>
          </div>
          <p className="text-slate-600 text-sm">{dict.footer.tagline}</p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold mb-3">{dict.footer.links}</h4>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-600 hover:text-[var(--brand)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">{dict.footer.contact}</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span
                className="icon icon-sm"
                style={{ ['--icon' as any]: "url('/icons/whatsapp.svg')" }}
                aria-hidden
              />
              <a
                href="https://wa.me/18687759858"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-[var(--brand)]"
              >
                {dict.contact.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="icon icon-sm"
                style={{ ['--icon' as any]: "url('/icons/mail.svg')" }}
                aria-hidden
              />
              <a
                href="mailto:support@byteworks.dev"
                className="text-slate-600 hover:text-[var(--brand)]"
              >
                {dict.contact.email_label}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-6 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} ByteWorks — {dict.footer.rights}</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-slate-600 hover:text-[var(--brand)]">
              {dict.footer.privacy}
            </Link>
            <Link href="/terms-of-service" className="text-slate-600 hover:text-[var(--brand)]">
              {dict.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}