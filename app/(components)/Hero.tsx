'use client';
import { useI18n } from '@/lib/i18n';
import Reveal from './Reveal';

export default function Hero() {
  const { dict } = useI18n();

  const points = [
    { icon: 'bolt', text: dict.hero.points.fast },
    { icon: 'shield', text: dict.hero.points.secure },
    { icon: 'puzzle', text: dict.hero.points.scalable },
    { icon: 'support', text: dict.hero.points.support },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <Reveal>
          <h1 className="text-3xl md:text-4xl font-semibold max-w-3xl">{dict.hero.title}</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-slate-600 max-w-2xl">{dict.hero.subtitle}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="#plans" className="btn btn-primary">{dict.hero.cta_primary}</a>
            <a href="#contact" className="btn">{dict.hero.cta_secondary}</a>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {points.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="icon icon-sm" style={{ ['--icon' as any]: `url('/icons/${p.icon}.svg')` }} aria-hidden />
                <span className="text-slate-700">{p.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}