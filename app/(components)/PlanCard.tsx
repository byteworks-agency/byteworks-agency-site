'use client';
import Reveal from './Reveal';

type Props = {
  title: string;
  priceMonthly: string;
  priceYearly: string;
  blurb: string;
  features: string[];
  cta: string;
  icon: string; // nombre del svg en /public/icons
  delay?: number;
};

export default function PlanCard(props: Props) {
  const { title, priceMonthly, priceYearly, blurb, features, cta, icon, delay = 0 } = props;

  return (
    <Reveal delay={delay}>
      <div className="card p-5 h-full flex flex-col">
        <div className="flex items-center gap-3">
          <span className="icon icon-md" style={{ ['--icon' as any]: `url('/icons/${icon}.svg')` }} aria-hidden />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-slate-700 mt-2 text-sm">{blurb}</p>
        <div className="mt-3 text-sm">
          <div>{priceMonthly}</div>
          <div className="text-slate-600">{priceYearly}</div>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="icon icon-check" style={{ ['--icon' as any]: "url('/icons/check.svg')" }} aria-hidden />
              <span className="text-slate-700">{f}</span>
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-primary mt-5">{cta}</a>
      </div>
    </Reveal>
  );
}