import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { submitNewsletterSignup, NewsletterSignupError } from '../lib/newsletter';

export function NewsletterInline() {
  const { language } = useLanguage();
  const isGreek = language === 'el';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextEmail = email.trim();
    if (!nextEmail) return;
    setStatus('loading');

    try {
      const result = await submitNewsletterSignup({
        email: nextEmail,
        language,
        source: 'article_inline',
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
      <div className="bg-[#EAE7E0] border border-[#E5E1D8] p-10 text-center my-12">
        <p className="font-serif italic text-2xl text-stone-900">
          {feedback || (isGreek ? 'Τέλεια! Σας προσθέσαμε στη λίστα.' : 'Awesome! You are on the list.')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#EAE7E0] border border-[#E5E1D8] p-6 sm:p-8 lg:p-12 my-12">
      <div className="text-[10px] uppercase tracking-[0.2em] mb-4 text-orange-600 font-medium">Newsletter</div>
      <h3 className="font-serif text-2xl sm:text-3xl leading-tight text-stone-900 mb-6 italic">
        {isGreek ? 'Σας άρεσε αυτό το άρθρο; Λαμβάνετε περισσότερα σαν κι αυτό.' : 'Enjoyed this? Get more articles like this.'}
      </h3>
      
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          required
          placeholder={isGreek ? "Email σας" : "Your Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0 rounded-none border border-stone-300 bg-stone-50 px-4 py-3 text-xs tracking-widest font-bold uppercase text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex justify-center items-center rounded-none bg-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold text-stone-900 border border-stone-200 hover:bg-stone-50 transition-colors disabled:opacity-70 w-full sm:w-auto"
        >
          {status === 'loading' ? 'WAIT' : (isGreek ? 'Εγγραφη' : 'Subscribe')}
        </button>
      </form>
      {feedback && status === 'error' ? (
        <p className="mt-4 text-sm text-red-700" aria-live="polite">
          {feedback}
        </p>
      ) : null}
      <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-stone-500 opacity-80">
        {isGreek ? 'Χωρίς spam. Διαγραφή οποιαδήποτε στιγμή.' : 'No spam. Unsubscribe anytime.'}
      </p>
    </div>
  );
}
