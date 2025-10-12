'use client';
import { useI18n } from '@/lib/i18n';
import Reveal from './Reveal';

export default function AboutSection() {
  const { dict } = useI18n();

  return (
    <div className="container">
      <Reveal>
        <h2 className="text-3xl font-bold mb-2">{dict.about.title}</h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="text-slate-600 max-w-2xl">{dict.about.subtitle}</p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dict.about.items.map((it, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="card p-4 flex items-start gap-3">
              <span className="icon icon-md" style={{ ['--icon' as any]: `url('/icons/${it.icon}.svg')` }} aria-hidden />
              <p className="text-slate-700">{it.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}