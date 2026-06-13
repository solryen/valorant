import type { Language } from '../contexts/LanguageContext';
import { isSupabaseConfigured, supabase } from './supabase';

export type NewsletterSource = 'homepage_banner' | 'article_inline';

export interface NewsletterAgeRange {
  label: string;
  min: number;
  max: number;
}

export interface NewsletterSubmissionInput {
  email: string;
  language: Language;
  source: NewsletterSource;
  ageRange?: NewsletterAgeRange | null;
}

export class NewsletterSignupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewsletterSignupError';
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function submitNewsletterSignup(input: NewsletterSubmissionInput) {
  if (!isSupabaseConfigured || !supabase) {
    throw new NewsletterSignupError('Supabase is not configured for newsletter signups yet.');
  }

  const email = normalizeEmail(input.email);
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/`
    : undefined;

  const { error: insertError } = await supabase.from('newsletter_subscribers').insert({
    email,
    baby_age_label: input.ageRange?.label ?? null,
    baby_age_min: input.ageRange?.min ?? null,
    baby_age_max: input.ageRange?.max ?? null,
    language: input.language,
    source: input.source,
  });

  if (insertError && insertError.code !== '23505') {
    throw new NewsletterSignupError(insertError.message);
  }

  const { error: authError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (authError) {
    return { email, authEmailSent: false, authMessage: authError.message };
  }

  return { email, authEmailSent: true, authMessage: null };
}
