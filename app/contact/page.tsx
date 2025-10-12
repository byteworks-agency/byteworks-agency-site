'use client';

import ContactSection from '../(components)/ContactSection';
import { useI18n } from '@/lib/i18n';

export default function ContactPage() {
  const { dict } = useI18n();

  return (
    <main>
      <section className="py-16">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold">{dict.contact.title}</h1>
          <p className="mt-3 text-slate-600">{dict.contact.subtitle}</p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-28">
        <ContactSection />
      </section>
    </main>
  );
}