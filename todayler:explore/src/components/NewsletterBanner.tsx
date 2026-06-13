import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AGE_RANGES_EN, AGE_RANGES_EL } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { submitNewsletterSignup, NewsletterSignupError } from '../lib/newsletter';

export function NewsletterBanner() {
  const { language } = useLanguage();
  const isGreek = language === 'el';
  const AGE_RANGES = isGreek ? AGE_RANGES_EL : AGE_RANGES_EN;
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const selectedAgeRange = useMemo(
    () => AGE_RANGES.find((range) => range.label === age) ?? null,
    [AGE_RANGES, age]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextEmail = email.trim();
    if (!nextEmail) return;

    setStatus('loading');
    setFeedback('');

    try {
      const result = await submitNewsletterSignup({
        email: nextEmail,
        language,
        source: 'homepage_banner',
        ageRange: selectedAgeRange,
      });
      setStatus('success');
      setFeedback(
        result.authEmailSent
          ? isGreek
            ? 'Θα λάβετε email επιβεβαίωσης σύντομα.'
            : 'Check your inbox for the confirmation email.'
          : isGreek
            ? 'Σας προσθέσαμε στη λίστα.'
            : 'You are on the list.'
      );
      setEmail('');
      setAge('');
    } catch (error: unknown) {
      setStatus('error');
      if (error instanceof NewsletterSignupError) {
        setFeedback(error.message);
      } else {
        setFeedback(isGreek ? 'Δεν ήταν δυνατή η εγγραφή αυτή τη στιγμή.' : 'We could not complete the signup right now.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-stone-900 p-6 sm:p-12 text-center border border-stone-900 text-stone-50">
        <h3 className="font-serif text-2xl sm:text-4xl leading-[1.1] mb-4">
          {isGreek ? 'Τέλεια! Σας προσθέσαμε στη λίστα.' : 'Awesome! You are on the list.'}
        </h3>
        <p className="text-sm leading-relaxed opacity-80 uppercase tracking-widest font-medium">
          {isGreek ? 'Επιτυχής Εγγραφή.' : 'Subscription Successful.'}
        </p>
        {feedback ? (
          <p className="mt-4 text-sm opacity-80" aria-live="polite">
            {feedback}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="bg-stone-900 p-6 sm:p-8 lg:p-12 border border-stone-900 overflow-hidden relative text-stone-50">
      <div className="relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-10 items-start lg:items-center">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] mb-4 text-orange-600 font-medium">
            {isGreek ? '📬 Μείνετε ενήμεροι' : '📬 Stay Updated'}
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl leading-[1.1] mb-4 sm:mb-6">
            {isGreek ? 'Η ανάπτυξη του μωρού σας, στο inbox σας.' : 'Your baby\'s development, in your inbox.'}
          </h2>
          <p className="text-sm leading-relaxed opacity-80 font-light">
            {isGreek ? 'Χωρίς spam. Μόνο χρήσιμες συμβουλές και ορόσημα ανάλογα με την ηλικία, απευθείας από την ομάδα μας.' : 'No spam. Just helpful, age-specific insights and milestones, straight from our team.'}
          </p>
          {feedback && status === 'error' ? (
            <p className="mt-4 text-sm text-orange-300" aria-live="polite">
              {feedback}
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 lg:pl-12 lg:border-l lg:border-stone-700">
          <div>
            <label htmlFor="age" className="block text-[10px] uppercase tracking-tighter opacity-50 mb-2">
              {isGreek ? 'Ηλικία μωρού (προαιρετικό):' : 'Baby\'s Age (Optional):'}
            </label>
            <div className="relative">
              <select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="block w-full appearance-none rounded-none border border-stone-700 bg-stone-800 px-4 py-3 pr-10 text-stone-50 focus:border-orange-600 focus:outline-none text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
              >
                <option value="">{isGreek ? '— Επιλέξτε Ηλικία —' : '— Select Age —'}</option>
                {AGE_RANGES.map((range) => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-[10px] uppercase tracking-tighter opacity-50 mb-2">
              {isGreek ? 'Email σας *' : 'Your Email *'}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                id="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-none border border-stone-700 bg-stone-800 px-4 py-3 text-stone-50 placeholder-stone-500 focus:border-orange-600 focus:outline-none text-xs tracking-widest font-medium transition-colors min-w-0"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex justify-center flex-shrink-0 items-center rounded-none bg-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-stone-900 border border-white hover:bg-stone-200 hover:border-stone-200 focus:outline-none transition-colors disabled:opacity-70 w-full sm:w-auto"
              >
                {status === 'loading' ? 'WAIT...' : (isGreek ? 'Εγγραφή' : 'Subscribe')}
              </button>
            </div>
            {feedback && status !== 'error' ? (
              <p className="mt-3 text-sm text-stone-300" aria-live="polite">
                {feedback}
              </p>
            ) : null}
            <p className="mt-4 text-[10px] uppercase tracking-widest text-stone-500 font-medium">
              {isGreek ? 'Μπορείτε να διαγραφείτε οποιαδήποτε στιγμή.' : 'You can unsubscribe at any time.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
