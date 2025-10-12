'use client';

import Hero from './(components)/Hero';
import AboutSection from './(components)/AboutSection';
import WhyChoose from './(components)/WhyChoose';
import PlanCard from './(components)/PlanCard';
import AddonCard from './(components)/AddonCard';
import FAQ from './(components)/FAQ';
import ContactSection from './(components)/ContactSection';
import Reveal from './(components)/Reveal';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { dict } = useI18n();

  // ========= PLANS =========
  // Estructura según tu JSON actual:
  // dict.plans.start.title | blurb | cta | features | icon
  // (y los precios los colocas tú, como ya lo tenías)
  const plans = [
    {
      title: dict.plans.start.title,
      priceMonthly: '$45/month',
      priceYearly: '$459/year (save 15%)',
      blurb: dict.plans.start.blurb,
      features: dict.plans.start.features,
      cta: dict.plans.start.cta,
      icon: dict.plans.start.icon,
    },
    {
      title: dict.plans.pro.title,
      priceMonthly: '$55/month',
      priceYearly: '$561/year (save 15%)',
      blurb: dict.plans.pro.blurb,
      features: dict.plans.pro.features,
      cta: dict.plans.pro.cta,
      icon: dict.plans.pro.icon,
    },
    {
      title: dict.plans.elite.title,
      priceMonthly: '$70/month',
      priceYearly: '$714/year (save 15%)',
      blurb: dict.plans.elite.blurb,
      features: dict.plans.elite.features,
      cta: dict.plans.elite.cta,
      icon: dict.plans.elite.icon,
    },
    {
      title: dict.plans.ecommerce.title,
      priceMonthly: '$95/month',
      priceYearly: '$969/year (save 15%)',
      blurb: dict.plans.ecommerce.blurb,
      features: dict.plans.ecommerce.features,
      cta: dict.plans.ecommerce.cta,
      icon: dict.plans.ecommerce.icon,
    },
  ];

  // ========= ADDONS =========
  // Estructura según tu JSON actual:
  // dict.addons.seo.* | dict.addons.blog.* | dict.addons.smallstore.* | dict.addons.branding.*
  const addons = [
    {
      title: dict.addons.seo.title,
      price: '+$30/month',
      bullets: dict.addons.seo.bullets,
      description: dict.addons.seo.description,
      icon: dict.addons.seo.icon,
    },
    {
      title: dict.addons.blog.title,
      price: '+$25/month',
      bullets: dict.addons.blog.bullets,
      description: dict.addons.blog.description,
      icon: dict.addons.blog.icon,
    },
    {
      title: dict.addons.smallstore.title,
      price: '+$35/month',
      bullets: dict.addons.smallstore.bullets,
      description: dict.addons.smallstore.description,
      icon: dict.addons.smallstore.icon,
    },
    {
      title: dict.addons.branding.title,
      price: '$120 one-time',
      bullets: dict.addons.branding.bullets,
      description: dict.addons.branding.description,
      icon: dict.addons.branding.icon,
    },
  ];

  return (
    <main>
      {/* HERO */}
      <Hero />

      {/* ABOUT */}
      <section id="about" className="py-20">
        <AboutSection />
      </section>

      {/* WHY CHOOSE */}
      <WhyChoose />

      {/* PLANS */}
      <section id="plans" className="py-20">
        <div className="container">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">{dict.sections.plans_title}</h2>
              <p className="text-slate-600">{dict.sections.plans_subtitle}</p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <PlanCard key={i} {...plan} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ADDONS */}
      <section id="addons" className="py-20 bg-[var(--card)]">
        <div className="container">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">{dict.sections.addons_title}</h2>
              <p className="text-slate-600">{dict.sections.addons_subtitle}</p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon, i) => (
              <AddonCard key={i} {...addon} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CONTACT */}
      <ContactSection />
    </main>
  );
}