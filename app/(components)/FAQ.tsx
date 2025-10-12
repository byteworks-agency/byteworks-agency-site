'use client';
import { useI18n } from '@/lib/i18n';
import Reveal from './Reveal';

export default function FAQ() {
  const { dict } = useI18n();
  const items = dict.faq.items;

  return (
    <div className="container">
      <Reveal>
        <h2 className="text-3xl font-bold mb-2">{dict.faq.title}</h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="text-slate-600 max-w-2xl">{dict.faq.subtitle}</p>
      </Reveal>

      <div className="mt-8 space-y-4">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <details className="card p-4">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-medium">{it.q}</span>
                <span className="icon icon-sm" style={{ ['--icon' as any]: "url('/icons/chevron-down.svg')" }} aria-hidden />
              </summary>
              <p className="mt-3 text-slate-700 text-sm">{it.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}