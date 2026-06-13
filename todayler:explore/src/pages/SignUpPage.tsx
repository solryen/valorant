import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signIn' | 'signUp' | 'reset';

function buildRedirectUrl(pathname: string, nextPath: string, extraParams?: Record<string, string>) {
  if (typeof window === 'undefined') return undefined;
  const url = new URL(pathname, window.location.origin);
  if (nextPath) {
    url.searchParams.set('next', nextPath);
  }
  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

export function SignUpPage() {
  const { language } = useLanguage();
  const {
    signInWithPassword,
    signUpWithPassword,
    sendPasswordResetEmail,
    completePasswordReset,
    session,
    passwordRecovery,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGreek = language === 'el';

  const nextPath = useMemo(
    () => searchParams.get('next') || '/explore',
    [searchParams],
  );
  const isRecoveryLink = searchParams.get('mode') === 'recover';
  const recoveryModeActive = isRecoveryLink || passwordRecovery;

  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'recover') {
      setMode('reset');
    }
  }, [searchParams]);

  useEffect(() => {
    if (session?.user?.email && !recoveryModeActive) {
      navigate(nextPath, { replace: true });
    }
  }, [navigate, nextPath, recoveryModeActive, session?.user?.email]);

  useEffect(() => {
    setMessage('');
    setError('');
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  }, [mode, recoveryModeActive]);

  const adminNote = isGreek
    ? 'Το 8loop ξεκλειδώνει άμεσα την πρόσβαση διαχείρισης από το footer promo.'
    : '8loop unlocks admin access directly from the footer promo.';

  const submitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await signInWithPassword(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(nextPath, { replace: true });
    }

    setLoading(false);
  };

  const submitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError(isGreek ? 'Οι κωδικοί δεν ταιριάζουν.' : 'Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await signUpWithPassword(email, password, buildRedirectUrl('/explore/signup', nextPath));
    if (result.error) {
      setError(result.error);
    } else if (result.session) {
      navigate(nextPath, { replace: true });
    } else {
      setMessage(
        isGreek
          ? 'Ελέγξτε το email σας για να επιβεβαιώσετε τον λογαριασμό.'
          : 'Check your email to confirm the new account.',
      );
    }

    setLoading(false);
  };

  const submitResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await sendPasswordResetEmail(email, buildRedirectUrl('/explore/signup?mode=recover', nextPath));
    if (result.error) {
      setError(result.error);
    } else {
      setMessage(
        isGreek
          ? 'Στάλθηκε σύνδεσμος επαναφοράς στο email σας.'
          : 'Password reset email sent.',
      );
    }

    setLoading(false);
  };

  const submitRecoveryPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== newPasswordConfirm) {
      setError(isGreek ? 'Οι νέοι κωδικοί δεν ταιριάζουν.' : 'New passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await completePasswordReset(newPassword);
    if (result.error) {
      setError(result.error);
    } else {
      setMessage(
        isGreek
          ? 'Ο κωδικός ενημερώθηκε. Η μεταφορά σας ολοκληρώνεται...'
          : 'Password updated. Finishing sign-in...',
      );
      navigate(nextPath, { replace: true });
    }

    setLoading(false);
  };

  const title = recoveryModeActive
    ? isGreek
      ? 'Ορισμός νέου κωδικού'
      : 'Set a new password'
    : mode === 'signUp'
      ? isGreek
        ? 'Δημιουργία λογαριασμού'
        : 'Create your account'
      : isGreek
        ? 'Συνδεση στον λογαριασμό'
        : 'Sign in';

  const subtitle = recoveryModeActive
    ? isGreek
      ? 'Ολοκληρώστε την επαναφορά κωδικού.'
      : 'Finish resetting your password.'
    : mode === 'signUp'
      ? isGreek
        ? 'Εγγραφείτε με email και κωδικό.'
        : 'Create a new account with email and password.'
      : mode === 'reset'
        ? isGreek
          ? 'Στείλτε σύνδεσμο επαναφοράς κωδικού.'
          : 'Send a password reset link.'
        : isGreek
          ? 'Συνδεθείτε με τον υπάρχοντα λογαριασμό σας.'
          : 'Use your existing account credentials.';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="text-sm text-stone-500">
          {isGreek ? 'Φόρτωση σύνδεσης...' : 'Loading auth...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#EAE7E0] border border-[#E5E1D8] p-10 shadow-sm relative">
        <h1 className="font-serif text-4xl text-stone-900 mb-2 italic text-center">
          {title}
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#8B7E66] mb-6 font-medium text-center">
          {subtitle}
        </p>

        {!recoveryModeActive && (
          <div className="flex items-center justify-center gap-2 mb-6 text-[10px] uppercase tracking-widest font-medium">
            <button
              type="button"
              onClick={() => setMode('signIn')}
              className={`px-3 py-2 border transition-colors ${mode === 'signIn' ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'}`}
            >
              {isGreek ? 'Σύνδεση' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setMode('signUp')}
              className={`px-3 py-2 border transition-colors ${mode === 'signUp' ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'}`}
            >
              {isGreek ? 'Εγγραφή' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={() => setMode('reset')}
              className={`px-3 py-2 border transition-colors ${mode === 'reset' ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'}`}
            >
              {isGreek ? 'Επαναφορά' : 'Reset'}
            </button>
          </div>
        )}

        <p className="text-xs text-stone-600 mb-6 text-center">
          {adminNote}
        </p>

        {recoveryModeActive ? (
          <form onSubmit={submitRecoveryPassword} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder={isGreek ? 'Νέος κωδικός' : 'New password'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="new-password"
            />
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(event) => setNewPasswordConfirm(event.target.value)}
              placeholder={isGreek ? 'Επιβεβαίωση νέου κωδικού' : 'Confirm new password'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-stone-900 text-stone-50 py-4 text-[10px] uppercase tracking-widest font-bold border border-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (isGreek ? 'Αποθήκευση...' : 'Saving...') : isGreek ? 'Ενημέρωση κωδικού' : 'Update password'}
            </button>
          </form>
        ) : mode === 'signIn' ? (
          <form onSubmit={submitSignIn} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={isGreek ? 'name@example.com' : 'name@example.com'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="email"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isGreek ? 'Κωδικός πρόσβασης' : 'Password'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-stone-900 text-stone-50 py-4 text-[10px] uppercase tracking-widest font-bold border border-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading
                ? isGreek
                  ? 'Σύνδεση...'
                  : 'Signing in...'
                : isGreek
                  ? 'Σύνδεση'
                  : 'Sign In'}
            </button>
          </form>
        ) : mode === 'signUp' ? (
          <form onSubmit={submitSignUp} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={isGreek ? 'name@example.com' : 'name@example.com'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="email"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isGreek ? 'Κωδικός πρόσβασης' : 'Password'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="new-password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={isGreek ? 'Επιβεβαίωση κωδικού' : 'Confirm password'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-stone-900 text-stone-50 py-4 text-[10px] uppercase tracking-widest font-bold border border-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (isGreek ? 'Δημιουργία...' : 'Creating...') : isGreek ? 'Εγγραφή' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitResetRequest} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={isGreek ? 'name@example.com' : 'name@example.com'}
              className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-stone-900 text-stone-50 py-4 text-[10px] uppercase tracking-widest font-bold border border-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (isGreek ? 'Αποστολή...' : 'Sending...') : isGreek ? 'Αποστολή συνδέσμου' : 'Send reset link'}
            </button>
          </form>
        )}

        {message ? (
          <p className="mt-4 text-sm text-stone-700" aria-live="polite">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm text-red-700" aria-live="polite">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
