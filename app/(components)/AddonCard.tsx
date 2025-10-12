'use client';
import Reveal from './Reveal';

type Props = {
  title: string;
  price: string;
  bullets: string[];
  description: string;
  icon: string;
  delay?: number;
};

export default function AddonCard({ title, price, bullets, description, icon, delay = 0 }: Props) {
  return (
    <Reveal delay={delay}>
      <div className="card p-5 h-full flex flex-col">
        <div className="flex items-center gap-3">
          <span className="icon icon-md" style={{ ['--icon' as any]: `url('/icons/${icon}.svg')` }} aria-hidden />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-slate-600 mt-1 text-sm">{price}</p>

        <ul className="mt-3 space-y-2 text-sm">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="icon icon-check" style={{ ['--icon' as any]: "url('/icons/check.svg')" }} aria-hidden />
              <span className="text-slate-700">{b}</span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-slate-700 text-sm">{description}</p>
      </div>
    </Reveal>
  );
}