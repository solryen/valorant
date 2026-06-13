import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

export function Footer() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const isGreek = language === 'el';
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode === '8loop') {
      const success = await login('8loop');
      if (success) {
        setShowPromo(false);
        setPromoCode('');
        navigate('/explore/admin');
      }
    } else {
      alert('Invalid promo code');
    }
  };

  return (
    <>
      <footer className="bg-stone-900 text-stone-50 py-16 mt-20 border-t border-stone-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex flex-col gap-2 border-r border-white/20 pr-8 py-2">
              <div className="flex items-center gap-6">
                <span className="text-2xl font-serif italic tracking-tight font-semibold">Todayler.</span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-80">
                  © 2026
                </span>
              </div>
              <p className="text-[11px] text-stone-400 italic font-serif">Because <span className="font-semibold text-stone-300 tracking-wider not-italic">Today</span> is all about your <span className="font-semibold text-stone-300 tracking-wider not-italic">Toddler</span>.</p>
            </div>
            <a 
              href="https://apps.apple.com/gr/app/todayler-baby-tracker/id6761668150" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center border border-white/20 px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-white hover:text-stone-900 transition-colors"
            >
              {isGreek ? 'Ληψη Εφαρμογης' : 'Download App'}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-[11px] uppercase tracking-widest font-light">
            <a href="mailto:todaylerapp@gmail.com" className="hover:text-orange-600 transition-colors">{isGreek ? 'Επικοινωνια' : 'Contact'}</a>
            <Link to="/explore/privacy" className="hover:text-orange-600 transition-colors">{isGreek ? 'Πολιτικη Απορρητου' : 'Privacy'}</Link>
            <Link to="/explore/terms" className="hover:text-orange-600 transition-colors">{isGreek ? 'Οροι Χρησης' : 'Terms'}</Link>
            <button onClick={() => setShowPromo(true)} className="hover:text-orange-600 transition-colors">PROMO</button>
          </div>
        </div>
      </footer>

      {showPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-stone-50 border border-stone-200 p-8 shadow-sm w-full max-w-sm relative">
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl text-stone-900 mb-3 italic text-center">PROMO CODE</h3>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-medium text-center mb-5">
              {isGreek ? 'Το 8loop ξεκλειδώνει άμεσα τα admin δικαιώματα' : '8loop unlocks admin access directly'}
            </p>
            <form onSubmit={handlePromoSubmit}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={isGreek ? 'Εισάγετε κωδικό' : 'Enter code'}
                className="w-full border border-stone-300 bg-white p-3 text-xs focus:border-stone-900 focus:outline-none placeholder:text-stone-400 text-stone-900 mb-4"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-stone-900 text-stone-50 py-3 text-[10px] uppercase tracking-widest font-bold border border-stone-900 hover:bg-stone-800 transition-colors"
              >
                {isGreek ? 'Συνέχεια' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
