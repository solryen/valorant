import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { GlobalSearch } from './GlobalSearch';
import { ChevronDown } from 'lucide-react';

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const isGreek = language === 'el';
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/explore');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-50 border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-4 sm:py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            <Link to="/explore" aria-label="Todayler Home" className="self-center md:self-auto text-stone-900 hover:opacity-70 transition-opacity">
          <span className="text-3xl font-serif italic tracking-tight font-semibold">Todayler.</span>
        </Link>
        <GlobalSearch />
        <nav aria-label="Main navigation" className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-4 sm:gap-y-2 text-[10px] sm:text-[11px] uppercase tracking-widest font-medium text-stone-900 items-center">
          <Link to="/explore" className="border-b border-stone-900">
            {isGreek ? 'Εξερευνηση' : 'Explore'}
          </Link>
          {isAdmin && (
            <Link to="/explore/admin" className="hover:text-amber-700 transition-colors">
              {isGreek ? 'Διαχειριση' : 'Dashboard'}
            </Link>
          )}
          <div className="relative">
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label={isGreek ? 'Αλλαγή Γλώσσας' : 'Change Language'}
              className="text-[12px] uppercase font-bold tracking-widest text-[#D98C64] hover:text-stone-900 transition-colors mx-2 flex items-center gap-1"
            >
              {isGreek ? 'ΕΛ' : 'EN'} <ChevronDown className="w-3 h-3" />
            </button>
            {langMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-stone-200 shadow-sm flex flex-col w-16 z-50">
                <button 
                  onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                  className={`py-2 text-[10px] uppercase font-bold hover:bg-stone-100 ${language === 'en' ? 'text-stone-900' : 'text-stone-500'}`}
                >
                  EN
                </button>
                <div className="h-px bg-stone-200 w-full" />
                <button 
                  onClick={() => { setLanguage('el'); setLangMenuOpen(false); }}
                  className={`py-2 text-[10px] uppercase font-bold hover:bg-stone-100 ${language === 'el' ? 'text-stone-900' : 'text-stone-500'}`}
                >
                  ΕΛ
                </button>
              </div>
            )}
          </div>
          {user ? (
            <button 
              onClick={handleSignOut}
              aria-label={isGreek ? 'Αποσύνδεση' : 'Sign Out'}
              className="hidden sm:inline-flex bg-stone-900 px-6 py-2.5 text-[10px] uppercase tracking-widest text-stone-50 hover:bg-stone-800 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/explore/signup?next=/explore" className="hidden sm:inline-flex bg-stone-900 px-6 py-2.5 text-[10px] uppercase tracking-widest text-stone-50 hover:bg-stone-800 transition-colors">
              {isGreek ? 'Σύνδεση / Εγγραφή' : 'Sign In / Sign Up'}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
