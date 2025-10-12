'use client';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  const { dict } = useI18n();
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-16">
      <div className="container">
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold">{dict.hero.title}</h1>
          <p className="mt-4 text-slate-600">{dict.hero.subtitle}</p>

          <div className="mt-8 flex items-center gap-3">
            <a href="#plans" className="btn btn-primary">{dict.hero.cta_primary}</a>
            <a href="#contact" className="btn">{dict.hero.cta_secondary}</a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-90">
            <div className="flex items-center gap-2 text-sm">
              <span className="icon" style={{ ['--icon' as any]: "url('/icons/bolt.svg')" }} />
              <span>{dict.hero.points.fast}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="icon" style={{ ['--icon' as any]: "url('/icons/shield.svg')" }} />
              <span>{dict.hero.points.secure}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="icon" style={{ ['--icon' as any]: "url('/icons/puzzle.svg')" }} />
              <span>{dict.hero.points.scalable}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="icon" style={{ ['--icon' as any]: "url('/icons/support.svg')" }} />
              <span>{dict.hero.points.support}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}