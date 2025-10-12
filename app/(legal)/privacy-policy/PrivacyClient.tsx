'use client';

import { useI18n } from '@/lib/i18n';

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function TermsClient() {
  const { dict } = useI18n();
  const L = dict.legal?.terms ?? {
    title: 'Terms of Service',
    updated: 'Last updated: October 2025',
    intro: 'By using this website and our services, you agree to these terms.',
    sections: {
      use: {
        title: 'Acceptable Use',
        li1: 'Do not misuse the site or attempt to disrupt its operation.',
        li2: 'Do not submit unlawful, harmful, or infringing content.',
        li3: 'Professional behavior is expected in all communications.',
      },
      content: {
        title: 'Content & Ownership',
        body:
          'All brand assets, layouts, and copy on this site are owned by ByteWorks unless stated otherwise. You may not reproduce them without written permission.',
      },
      plans: {
        title: 'Plans & Pricing',
        body:
          'Plans, features, and prices may change. Custom quotes may apply when requirements fall outside the published plans.',
      },
      limitation: {
        title: 'Limitation of Liability',
        body:
          'ByteWorks is not liable for indirect, incidental, or consequential damages arising from the use of this site or services.',
      },
      changes: {
        title: 'Changes to These Terms',
        body:
          'We may update these terms from time to time. Continued use of the site after changes constitutes acceptance.',
      },
      contact: {
        title: 'Contact',
        body: 'For any questions about these terms, email us at support@byteworks.dev.',
      },
    },
  };

  const sections: Section[] = [
    {
      id: 'use',
      title: `1. ${L.sections.use.title}`,
      content: (
        <ul>
          <li>{L.sections.use.li1}</li>
          <li>{L.sections.use.li2}</li>
          <li>{L.sections.use.li3}</li>
        </ul>
      ),
    },
    {
      id: 'content',
      title: `2. ${L.sections.content.title}`,
      content: <p>{L.sections.content.body}</p>,
    },
    {
      id: 'plans',
      title: `3. ${L.sections.plans.title}`,
      content: <p>{L.sections.plans.body}</p>,
    },
    {
      id: 'limitation',
      title: `4. ${L.sections.limitation.title}`,
      content: <p>{L.sections.limitation.body}</p>,
    },
    {
      id: 'changes',
      title: `5. ${L.sections.changes.title}`,
      content: <p>{L.sections.changes.body}</p>,
    },
    {
      id: 'contact',
      title: `6. ${L.sections.contact.title}`,
      content: <p>{L.sections.contact.body}</p>,
    },
  ];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold">{L.title}</h1>
        <p className="mt-2 text-slate-600">{L.updated}</p>
      </header>

      {/* Índice */}
      <nav aria-label="Table of contents" className="mb-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-slate-600 hover:text-[var(--brand)] underline-offset-4 hover:underline"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contenido */}
      <div className="prose prose-slate dark:prose-invert">
        <p>{L.intro}</p>
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <h2>{s.title}</h2>
            {s.content}
          </section>
        ))}
      </div>
    </>
  );
}