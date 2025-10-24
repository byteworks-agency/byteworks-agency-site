export type HomePlan = {
  name: string;
  price: string;
  yearly: string;
  features: readonly string[];
};

export type HomeFaq = {
  q: string;
  a: string;
};

export const HOME_PLAN_ICONS: Record<string, string> = {
  Start: '/icons/plans/start.svg',
  Pro: '/icons/plans/pro.svg',
  Elite: '/icons/plans/elite.svg',
  'E-Commerce Pro': '/icons/plans/ecommerce.svg',
};

export const HOME_PLANS: Record<'en' | 'es', readonly HomePlan[]> = {
  en: [
    {
      name: 'Start',
      price: '$45/mo',
      yearly: '$459/yr (save 15%)',
      features: [
        'Launch fast with a clean one-page site',
        'Looks great on mobile',
        'Simple contact so people can reach you',
      ],
    },
    {
      name: 'Pro',
      price: '$55/mo',
      yearly: '$561/yr (save 15%)',
      features: [
        'Multi-page site for services',
        'Explain what you do clearly',
        'Brand-aligned look that builds trust',
      ],
    },
    {
      name: 'Elite',
      price: '$70/mo',
      yearly: '$714/yr (save 15%)',
      features: [
        'Bigger site with custom sections',
        'Faster, more polished experience',
        'Monthly improvements included',
      ],
    },
    {
      name: 'E-Commerce Pro',
      price: '$95/mo',
      yearly: '$969/yr (save 15%)',
      features: [
        'Show products and take orders',
        'Simple cart and manual checkout',
        'Easy order management',
      ],
    },
  ],
  es: [
    {
      name: 'Start',
      price: '$45/mes',
      yearly: '$459/año (ahorra 15%)',
      features: [
        'Lanza rápido con una página clara',
        'Se ve perfecto en móviles',
        'Contacto simple para que te escriban',
      ],
    },
    {
      name: 'Pro',
      price: '$55/mes',
      yearly: '$561/año (ahorra 15%)',
      features: [
        'Sitio con varias secciones para servicios',
        'Explica con claridad lo que haces',
        'Diseño alineado a tu marca',
      ],
    },
    {
      name: 'Elite',
      price: '$70/mes',
      yearly: '$714/año (ahorra 15%)',
      features: [
        'Sitio más completo y a medida',
        'Más rápido y pulido',
        'Mejoras mensuales incluidas',
      ],
    },
    {
      name: 'E-Commerce Pro',
      price: '$95/mes',
      yearly: '$969/año (ahorra 15%)',
      features: [
        'Muestra productos y recibe pedidos',
        'Carrito simple y checkout manual',
        'Gestión fácil de pedidos',
      ],
    },
  ],
};

export const HOME_FAQS: Record<'en' | 'es', readonly HomeFaq[]> = {
  en: [
    {
      q: 'How fast can you deliver my website?',
      a: 'Start usually launches within 7-10 business days after we receive copy and assets. Pro/Elite take 2-4 weeks depending on scope and reviews.',
    },
    {
      q: 'What does "monthly update" include?',
      a: "Small, scoped tasks like text/image changes, minor layout tweaks, or product edits. They're time-boxed per plan and don't roll over (see Terms + Service Levels).",
    },
    {
      q: 'Do you handle online payments?',
      a: 'Not by default. Our E-Commerce Pro uses a manual order flow (no gateways). If you need payments later, we can quote a custom add-on.',
    },
    {
      q: 'Can I track delivery orders?',
      a: 'Yes. Orders receive a simple internal code you can share with your customer. Status is managed in our internal dashboard and displayed on a tracking page.',
    },
    {
      q: 'Who owns the domain and content?',
      a: 'You do. While your subscription is active we manage the technical stack; you retain ownership of brand assets, domain and content.',
    },
    {
      q: 'Bilingual by default?',
      a: 'Yes. English and Spanish routes/structure are included. If you only need one language, we can keep the other hidden.',
    },
    {
      q: 'SEO included?',
      a: 'All plans include basic SEO (structure, meta, sitemap). For ongoing improvements and local visibility, consider the Advanced SEO add-on.',
    },
    {
      q: 'Can I migrate later?',
      a: 'Yes. We can export your static site and hand over assets/data upon cancellation per our Terms.',
    },
  ],
  es: [
    {
      q: '¿En cuánto tiempo puedo tener mi sitio?',
      a: 'Start suele salir en 7–10 días hábiles desde que recibimos textos y assets. Pro/Elite toman 2–4 semanas según alcance y revisiones.',
    },
    {
      q: '¿Qué incluye la “actualización mensual”?',
      a: 'Tareas pequeñas como cambios de texto/imagen, ajustes de diseño o edición de productos. Están acotadas por tiempo según plan y no se acumulan (ver Términos + SLA).',
    },
    {
      q: '¿Incluye pagos en línea?',
      a: 'No por defecto. E‑Commerce Pro usa flujo de pedido manual (sin pasarela). Si luego necesitas pagos, podemos cotizarlo como add‑on.',
    },
    {
      q: '¿Puedo dar seguimiento a pedidos de delivery?',
      a: 'Sí. Cada pedido obtiene un código interno. El estado se maneja en nuestro dashboard interno y se muestra en una página de tracking.',
    },
  ],
};

