'use client';

import { useI18n } from '@/lib/i18n';

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function PrivacyClient() {
  const { dict } = useI18n();
  const L = dict.legal?.privacy ?? {
    title: 'Privacy Policy',
    updated: 'Last updated: October 2025',
    intro:
      'At ByteWorks, we respect your privacy. We only collect the minimum information needed to respond to your requests and provide our services.',
    sections: {
      collect: {
        title: 'Information We Collect',
        body:
          'When you contact us, we collect your name, email address, project type, and your message. We do not collect sensitive categories of personal data.',
      },
      use: {
        title: 'How We Use Your Information',
        li1: 'To reply to your inquiry and provide quotes or proposals.',
        li2: 'To manage leads and internal follow-ups in our workspace.',
        li3: 'To improve our site and services in aggregate (non-identifiable) ways.',
      },
      tools: {
        title: 'Third-Party Tools',
        body: 'We use trusted providers to deliver our services securely:',
        notion:
          '• Notion — stores lead metadata (name, email, project type, language). We do not store your message in Notion.',
        resend:
          '• Resend — sends emails (internal notification and optional auto-reply).',
        vercel:
          '• Vercel — hosts the website. Access logs may include IP address for security.',
      },
      retention: {
        title: 'Data Retention',
        body:
          'We keep lead information only as long as necessary for communication and business follow-up, after which we delete or anonymize it.',
      },
      rights: {
        title: 'Your Rights',
        body:
          'You may request access, correction, or deletion of your data by contacting us. We will respond within a reasonable timeframe.',
      },
      contact: {
        title: 'Contact',
        body: 'For privacy requests, email us at support@byteworks.dev.',
      },
    },
  };

  const sections: Section[] = [
    {
      id: 'collect',
      title: `1. ${L.sections.collect.title}`,
      content: <p>{L.sections.collect.body}</p>,
    },
    {
      id: 'use',
      title: `2. ${L.sections.use.title}`,
      content: (
        <ul>
          <li>{L.sections.use.li1}</li>
          <li>{L.sections.use.li2}</li>
          <li>{L.sections.use.li3}</li>
        </ul>
      ),
    },
    {
      id: 'tools',
      title: `3. ${L.sections.tools.title}`,
      content: (
        <>
          <p>{L.sections.tools.body}</p>
          <ul>
            <li>{L.sections.tools.notion}</li>
            <li>{L.sections.tools.resend}</li>
            <li>{L.sections.tools.vercel}</li>
          </ul>
        </>
      ),
    },
    {
      id: 'retention',
      title: `4. ${L.sections.retention.title}`,
      content: <p>{L.sections.retention.body}</p>,
    },
    {
      id: 'rights',
      title: `5. ${L.sections.rights.title}`,
      content: <p>{L.sections.rights.body}</p>,
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