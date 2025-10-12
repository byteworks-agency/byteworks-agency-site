'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import Reveal from './Reveal';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WhyChoose() {
  const { dict } = useI18n();

  return (
    <section id="why" className="py-20">
      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">{dict.why.title}</h2>
            <p className="mt-3 text-slate-600">{dict.why.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dict.why.items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.1 }}
              className="card p-6 rounded-xl shadow-sm border border-[var(--border)] bg-[var(--card)] transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-start h-14 w-14 rounded-full border border-[var(--border)] bg-[var(--bg)]">
                <span
                  className="icon icon-lg ml-3"
                  style={{ ['--icon' as any]: `url('/icons/${item.icon}.svg')` }}
                  aria-hidden
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}