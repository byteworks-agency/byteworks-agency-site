'use client';

import React, { useMemo, useState } from 'react';
import { z } from 'zod';
import { useI18n } from '@/lib/i18n';

const WHATSAPP_NUMBER = '18687759858';

// --- Zod schema (sin company) ---
const ContactSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name is too short' }),
  email: z.string().trim().email({ message: 'Invalid email' }),
  projectType: z.enum(['Website', 'E-commerce', 'Automation', 'Custom']).default('Website'),
  message: z.string().trim().min(10, { message: 'Message is too short' }),
  lang: z.enum(['en', 'es']).default('en'),
});

type FormValues = z.infer<typeof ContactSchema>;

export default function ContactSection() {
  const { dict, lang } = useI18n();

  // --- Form state ---
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    projectType: 'Website',
    message: '',
    lang,
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Traducciones mínimas
  const T = useMemo(
    () => ({
      invalidEmail: lang === 'es' ? 'Correo inválido' : 'Invalid email',
      nameShort: lang === 'es' ? 'Nombre demasiado corto' : 'Name is too short',
      messageShort: lang === 'es' ? 'Mensaje demasiado corto' : 'Message is too short',
      sending: lang === 'es' ? 'Enviando…' : 'Sending…',
      sent: lang === 'es' ? '¡Mensaje enviado! Te responderemos pronto.' : 'Message sent! We’ll reply soon.',
      error: lang === 'es' ? 'Error' : 'Error',
    }),
    [lang]
  );

  // WhatsApp
  const sendWhatsApp = () => {
    const lines = [
      `Name/Nombre: ${values.name}`,
      `Email: ${values.email}`,
      `Project: ${values.projectType}`,
      `Message/Mensaje: ${values.message}`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank');
  };

  // Validación por campo
  const validateField = (key: keyof FormValues, raw: unknown) => {
    const single = ContactSchema.pick({ [key]: true as any });
    const parsed = single.safeParse({ [key]: raw } as any);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message; // <-- usar issues
      setFieldErrors((e) => ({ ...e, [key]: translateError(key, msg) }));
    } else {
      setFieldErrors((e) => {
        const { [key]: _omit, ...rest } = e;
        return rest;
      });
    }
  };

  function translateError(key: keyof FormValues, msg?: string) {
    if (!msg) return '';
    if (key === 'email') return T.invalidEmail;
    if (key === 'name') return T.nameShort;
    if (key === 'message') return T.messageShort;
    return msg;
  }

  const canSubmit = useMemo(() => {
    if (sending) return false;
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) return false;
    const emailOk = z.string().email().safeParse(values.email).success;
    if (!emailOk) return false;
    return true;
  }, [sending, values]);

  // Handlers
  const handleChange =
    (key: keyof FormValues) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((v) => ({ ...v, [key]: e.target.value }));
      };

  const handleBlur = (key: keyof FormValues) => () => {
    validateField(key, values[key]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const parsed = ContactSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof FormValues, string>> = {};
      parsed.error.issues.forEach((iss) => {
        const k = iss.path[0] as keyof FormValues;
        nextErrors[k] = translateError(k, iss.message);
      });
      setFieldErrors(nextErrors);
      return;
    }

    setSending(true);
    setOk(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send');
      }

      setOk(true);
      setValues({
        name: '',
        email: '',
        projectType: 'Website',
        message: '',
        lang,
      });
      setFieldErrors({});
    } catch (err: any) {
      setOk(false);
      setErrorMsg(err?.message || T.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16">
      <div className="container">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold">{dict.contact.title}</h2>
          <p className="mt-3 text-slate-600">{dict.contact.subtitle}</p>
        </div>

        <form className="mt-8 max-w-xl grid grid-cols-1 gap-4" onSubmit={onSubmit} noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className="text-sm">{dict.contact.name}</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={values.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
              placeholder="John Doe"
              autoComplete="name"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            />
            {fieldErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-rose-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm">{dict.contact.email_label}</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
              placeholder="john@email.com"
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-rose-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Project type */}
          <div>
            <label htmlFor="projectType" className="text-sm">{dict.contact.project_type}</label>
            <select
              id="projectType"
              name="projectType"
              value={values.projectType}
              onChange={handleChange('projectType')}
              className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            >
              <option value="Website">Website</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Automation">Automation</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="text-sm">{dict.contact.message}</label>
            <textarea
              id="message"
              name="message"
              required
              value={values.message}
              onChange={handleChange('message')}
              onBlur={handleBlur('message')}
              className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
              rows={5}
              placeholder={dict.contact.placeholder}
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? 'message-error' : undefined}
            />
            {fieldErrors.message && (
              <p id="message-error" className="mt-1 text-sm text-rose-600">{fieldErrors.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              disabled={!canSubmit}
            >
              {sending && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              )}
              {sending ? T.sending : dict.contact.send_email}
            </button>

            <button
              type="button"
              onClick={sendWhatsApp}
              className="btn w-full sm:w-auto inline-flex items-center gap-2"
            >
              <span
                className="icon icon-sm"
                style={{ ['--icon' as any]: "url('/icons/whatsapp.svg')" }}
                aria-hidden
              />
              {dict.contact.send_whatsapp}
            </button>
          </div>

          {/* Mensajes de estado */}
          <div className="min-h-[1.25rem]" aria-live="polite">
            {ok === true && <p className="text-sm text-emerald-600 mt-2">{T.sent}</p>}
            {ok === false && (
              <p className="text-sm text-rose-600 mt-2">
                {T.error}: {errorMsg}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}