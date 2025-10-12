'use client';
import { useI18n } from '@/lib/i18n';
import Reveal from './Reveal';

export default function WhyChoose() {
  const { dict } = useI18n();

  return (
    <section className="py-20 bg-[var(--card)]">
      <div className="container">
        <Reveal>
          <h2 className="text-3xl font-bold mb-2">{dict.why.title}</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-slate-600 max-w-2xl">{dict.why.subtitle}</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dict.why.items.map((it, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="card p-5 h-full">
                <div className="flex items-center gap-3">
                  <span className="icon icon-md" style={{ ['--icon' as any]: `url('/icons/${it.icon}.svg')` }} aria-hidden />
                  <h3 className="font-semibold">{it.title}</h3>
                </div>
                <p className="text-slate-700 mt-3 text-sm">{it.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}