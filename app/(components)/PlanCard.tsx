'use client';
import React from 'react';

type Props = {
  title: string;
  priceMonthly: string;
  priceYearly: string;
  blurb: string;
  features: string[];
  cta?: string;
  icon?: string;
  delay?: number;
};

export default function PlanCard({
  title,
  priceMonthly,
  priceYearly,
  blurb,
  features,
  cta = 'Get started',
  icon,
}: Props) {
  return (
    <div className="card p-6 shadow-sm hover:shadow-md transition duration-300">
      <div className="flex items-start gap-3">
        {icon ? (
          <span
            className="icon icon-md mt-1"
            style={{ ['--icon' as any]: `url('/icons/${icon}.svg')` }}
            aria-hidden
          />
        ) : null}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-slate-600">{blurb}</p>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-[var(--brand)]">{priceMonthly}</span>
        <span className="text-sm text-slate-500">{priceYearly}</span>
      </div>

      <ul className="mt-5 space-y-2 text-sm">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className="icon icon-inline mt-[1px]"
              style={{ ['--icon' as any]: "url('/icons/check.svg')" }}
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className="btn-primary mt-6 w-full rounded-md px-4 py-2 font-medium transition-colors">
        {cta}
      </button>
    </div>
  );
}