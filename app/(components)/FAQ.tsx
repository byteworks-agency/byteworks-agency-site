'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Item = { q: string; a: string };

export default function FAQ() {
  const { dict } = useI18n();
  const prefersReduced = useReducedMotion();

  const items: Item[] = dict.faq.items;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // abre el primero

  const toggle = (i: number) => setOpenIndex((curr) => (curr === i ? null : i));

  return (
    <section id="faq" className="py-20">
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold">{dict.faq.title}</h2>
          {dict.faq.subtitle ? (
            <p className="mt-3 text-slate-600">{dict.faq.subtitle}</p>
          ) : null}
        </div>

        <div className="mt-10 max-w-3xl divide-y" style={{ borderColor: 'var(--border)' }}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const contentId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;

            return (
              <div key={i} className="py-3">
                <button
                  id={buttonId}
                  aria-controls={contentId}
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                  className="w-full flex items-start justify-between gap-4 text-left"
                >
                  <span className="font-medium">{item.q}</span>
                  <span
                    className={`icon chevron transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    style={{ ['--icon' as any]: "url('/icons/chevron-down.svg')" }}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={prefersReduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={prefersReduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 text-sm text-slate-600">{item.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}