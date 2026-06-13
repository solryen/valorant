import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useArticles } from '../contexts/ArticleContext';
import { useLanguage } from '../contexts/LanguageContext';

export function GlobalSearch() {
  const { articles } = useArticles();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredArticles = articles.filter(a => 
    a.language === language && 
    a.status !== 'draft' &&
    (a.title.toLowerCase().includes(query.toLowerCase()) || 
     a.category.toLowerCase().includes(query.toLowerCase()))
  );

  const isGreek = language === 'el';

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-lg mx-6 lg:mx-12 hidden md:block">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 opacity-50 text-stone-900" />
        <input 
          type="search"
          aria-label={isGreek ? "Αναζήτηση άρθρων" : "Search articles"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={isGreek ? "ΑΝΑΖΗΤΗΣΗ ΑΡΘΡΩΝ..." : "SEARCH ARTICLES..."}
          className="w-full bg-[#EAE7E0]/50 border border-transparent focus:bg-[#EAE7E0] hover:bg-[#EAE7E0] focus:border-[#D5D0C5] px-12 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-stone-900 focus:outline-none transition-all"
        />
      </div>
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#FDFBF7] border border-[#E5E1D8] shadow-2xl z-50 max-h-[400px] overflow-y-auto">
          {filteredArticles.length > 0 ? (
            <div className="p-2 flex flex-col">
              {filteredArticles.map(a => (
                <Link 
                  key={a.id} 
                  to={`/explore/${a.slug}`}
                  onClick={() => { setIsOpen(false); setQuery(''); }}
                  className="p-4 hover:bg-[#EAE7E0] transition-colors group flex flex-col border-b border-[#E5E1D8] last:border-b-0"
                >
                  <span className="text-[9px] uppercase tracking-widest text-[#8B7E66] mb-1 group-hover:text-[#D98C64] transition-colors">{a.category}</span>
                  <span className="font-serif text-lg text-stone-900 line-clamp-1 italic">{a.title}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[10px] uppercase tracking-widest text-[#8B7E66]">
              {isGreek ? "Δεν βρέθηκαν αποτελέσματα." : "No results found."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
