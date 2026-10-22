'use client';

import { ChevronDown } from 'lucide-react';
import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { contact } from '@/actions/contact';
import { Button } from '@/components/ui/Button';
import { controlClasses, describedBy, FormField } from '@/components/ui/FormField';
import { Toast, type ToastData } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import {
  BUDGETS,
  ContactInput,
  fieldErrors,
  PROJECT_TYPES,
  TIMELINES,
  TOPICS,
  type ContactField,
  type ContactState,
} from '@/lib/contact-schema';

export function ContactForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(contact, { status: 'idle' });
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [toast, setToast] = useState<ToastData | null>(null);
  const [topic, setTopic] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const dismiss = useCallback(() => setToast(null), []);

  // "Start a project" buttons elsewhere on the page preselect the topic
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLElement>('[data-topic]');
      if (link?.dataset.topic) setTopic(link.dataset.topic);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    // React to each new action result once (adjusting state during render, not in an effect)
    setHandled(state);
    if (state.status === 'invalid') setErrors(state.errors);
    if (state.status === 'sent') {
      setErrors({});
      setTopic('');
      setToast((t) => ({
        id: (t?.id ?? 0) + 1,
        tone: 'success',
        title: 'Message sent',
        detail: 'Kushwant replies within 24 hours.',
      }));
    }
    if (state.status === 'failed')
      setToast((t) => ({
        id: (t?.id ?? 0) + 1,
        tone: 'error',
        title: "Couldn't send your message",
        detail: `Check your connection and try again, or email ${email} directly.`,
      }));
  }

  useEffect(() => {
    if (state.status === 'sent') form.current?.reset();
    if (state.status === 'invalid')
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  // Errors appear when a field loses focus or on submit, never while the visitor is typing
  const validateField = (name: ContactField, el: HTMLFormElement | null) => {
    if (!el) return;
    const result = ContactInput.safeParse(Object.fromEntries(new FormData(el)));
    const next = result.success ? {} : fieldErrors(result.error);
    setErrors((e) => ({ ...e, [name]: next[name] }));
  };
  const clearOnFix = (name: ContactField, el: HTMLFormElement | null) => errors[name] && validateField(name, el);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const result = ContactInput.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!result.success) {
      e.preventDefault();
      setErrors(fieldErrors(result.error));
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
    }
  };

  const values = state.status === 'invalid' || state.status === 'failed' ? state.values : {};
  const field = (name: ContactField) => ({
    id: `contact-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': describedBy(`contact-${name}`, errors[name]),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      validateField(name, e.currentTarget.form),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      clearOnFix(name, e.currentTarget.form),
    defaultValue: values[name],
  });

  return (
    <>
      <form ref={form} action={action} onSubmit={onSubmit} noValidate className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="contact-name" label="Name" error={errors.name}>
            <input {...field('name')} autoComplete="name" required className={controlClasses} />
          </FormField>
          <FormField id="contact-email" label="Email" error={errors.email}>
            <input
              {...field('email')}
              type="email"
              autoComplete="email"
              required
              className={controlClasses}
            />
          </FormField>
        </div>
        <FormField id="contact-topic" label="What's this about?" error={errors.topic}>
          <Chevron>
            <select
              {...field('topic')}
              required
              value={topic || values.topic || ''}
              defaultValue={undefined}
              onChange={(e) => {
                setTopic(e.target.value);
                clearOnFix('topic', e.currentTarget.form);
              }}
              className={cn(controlClasses, 'appearance-none pr-11')}
            >
              <option value="" disabled>
                Choose one
              </option>
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Chevron>
        </FormField>
        {/* Revealed by CSS when "Freelance project" is selected, so it works without JavaScript too */}
        <fieldset className="freelance-fields hidden gap-4 sm:grid-cols-3">
          <legend className="sr-only">Project details</legend>
          <FormField id="contact-projectType" label="Project type" optional>
            <Chevron>
              <select
                id="contact-projectType"
                name="projectType"
                defaultValue={values.projectType ?? ''}
                className={cn(controlClasses, 'appearance-none pr-11')}
              >
                <option value="">Choose one</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Chevron>
          </FormField>
          <FormField id="contact-budget" label="Budget" optional>
            <Chevron>
              <select
                id="contact-budget"
                name="budget"
                defaultValue={values.budget ?? ''}
                className={cn(controlClasses, 'appearance-none pr-11')}
              >
                <option value="">Choose one</option>
                {BUDGETS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Chevron>
          </FormField>
          <FormField id="contact-timeline" label="Timeline" optional>
            <Chevron>
              <select
                id="contact-timeline"
                name="timeline"
                defaultValue={values.timeline ?? ''}
                className={cn(controlClasses, 'appearance-none pr-11')}
              >
                <option value="">Choose one</option>
                {TIMELINES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Chevron>
          </FormField>
        </fieldset>
        <FormField id="contact-message" label="Message" error={errors.message}>
          <textarea
            {...field('message')}
            required
            rows={5}
            className={cn(controlClasses, 'min-h-[140px] resize-y field-sizing-content')}
          />
        </FormField>
        {/* Honeypot: hidden from people and assistive technology, tempting to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div>
          <Button type="submit" busy={pending}>
            {pending ? 'Sending message' : 'Send message'}
          </Button>
        </div>
      </form>
      <Toast toast={toast} onDismiss={dismiss} />
    </>
  );
}

function Chevron({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-2"
        strokeWidth={1.75}
      />
    </div>
  );
}
