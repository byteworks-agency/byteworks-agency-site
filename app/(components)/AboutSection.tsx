'use client';
import React from 'react';
import Reveal from './Reveal';
import { useI18n } from '@/lib/i18n';

export type AboutItem = { icon: string; text: string; };
export type AboutContent = {
  title: string;
  subtitle: string;
  items?: AboutItem[];
  points?: string[];
};

type Props = { content?: AboutContent; };

export default function AboutSection({ content }: Props) {
  const { dict } = useI18n();
  const data: AboutContent = content ?? (dict.about as AboutContent);

  const list: AboutItem[] =
    data.items && data.items.length
      ? data.items
      : (data.points || []).map((t) => ({ icon: 'check', text: t }));

  return (
    <section id="about">
      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">{data.title}</h2>
            <p className="mt-3 text-slate-600">{data.subtitle}</p>
          </div>

          <ul className="mt-8 max-w-2xl space-y-3 text-slate-600">
            {list.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="icon icon-inline"
                  style={{ ['--icon' as any]: `url('/icons/${item.icon}.svg')` }}
                  aria-hidden
                />
                <span className="text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}