'use client';
import React from 'react';

type Props = {
  title: string;
  price: string;
  bullets: string[];
  description?: string;
  icon?: string;
  delay?: number;
};

export default function AddonCard({
  title,
  price,
  bullets,
  description,
  icon,
}: Props) {
  return (
    <div className="card p-5 shadow-sm hover:shadow-md transition duration-300">
      <div className="flex items-start gap-3">
        {icon ? (
          <span
            className="icon icon-md mt-1"
            style={{ ['--icon' as any]: `url('/icons/${icon}.svg')` }}
            aria-hidden
          />
        ) : null}
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h4 className="text-lg font-semibold">{title}</h4>
            <span className="text-sm text-slate-600">{price}</span>
          </div>
          {description ? (
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span
              className="icon icon-inline mt-[1px]"
              style={{ ['--icon' as any]: "url('/icons/check.svg')" }}
              aria-hidden
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}