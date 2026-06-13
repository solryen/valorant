import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronDown } from 'lucide-react';
import { CATEGORIES_EN, CATEGORIES_EL, AGE_RANGES_EN, AGE_RANGES_EL, CATEGORIES } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { NewsletterBanner } from '../components/NewsletterBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { useArticles } from '../contexts/ArticleContext';

export function ExplorePage() {
  const { language } = useLanguage();
  const { articles } = useArticles();
  const isGreek = language === 'el';

  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Must match language
      if (article.language !== language) return false;
      if (article.status === 'draft') return false;

      // Filter by category
      if (selectedCategory && article.category !== selectedCategory) return false;
      
      // Filter by age (match if the selected age min/max overlaps with article's range)
      if (selectedAge) {
        const RANGE_LIST = language === 'el' ? AGE_RANGES_EL : AGE_RANGES_EN;
        const range = RANGE_LIST.find(r => r.label === selectedAge);
        if (range) {
          // If the article's max age is less than the range's min, or min age > range max, they don't overlap
          if (article.baby_age_max < range.min || article.baby_age_min > range.max) {
             return false;
          }
        }
      }

      // Filter by search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesTags = article.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTags) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }, [selectedCategory, selectedAge, searchQuery, language]);

  const currentCategories = isGreek ? CATEGORIES_EL : CATEGORIES_EN;
  const currentAgeRanges = isGreek ? AGE_RANGES_EL : AGE_RANGES_EN;
  
  return (
    <div className="min-h-screen bg-stone-50">
      <Helmet>
        <title>{isGreek ? 'Εξερεύνηση | Todayler' : 'Explore Articles | Todayler'}</title>
        <meta name="description" content={isGreek ? 'Ανακαλύψτε άρθρα με υποστήριξη από ειδικούς...' : 'Discover expert-backed articles for early childhood and baby development.'} />
        <link rel="canonical" href="https://todayler.com/explore" />
        <meta property="og:title" content={isGreek ? 'Εξερεύνηση | Todayler' : 'Explore Articles | Todayler'} />
        <meta property="og:description" content={isGreek ? 'Ανακαλύψτε άρθρα με υποστήριξη από ειδικούς...' : 'Discover expert-backed articles for early childhood and baby development.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://todayler.com/explore" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Todayler",
            "url": "https://todayler.com/explore",
            "potentialAction": {
              "@type": "SearchAction",
            "target": "https://todayler.com/explore?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <header className="mb-10 sm:mb-16 border-b border-stone-200 pb-8 sm:pb-10">
          <div className="text-[11px] uppercase tracking-[0.2em] mb-4 text-stone-600 font-medium">
            {isGreek ? 'Εξερεύνηση • 0 εως 24 μηνων' : 'Explore • 0 to 24 months'}
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-stone-900 mb-6 italic max-w-[10ch] sm:max-w-none">
            {isGreek ? 'Συμβουλές & Δραστηριότητες' : 'Articles & Editorials'}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-stone-700 opacity-80 mb-8">
            {isGreek ? 'Επιλεγμένα άρθρα από την ομάδα Todayler για την ανάπτυξη, τον ύπνο και τη διατροφή του μωρού σας.' : 'Curated strategies, activities, and insights for your baby\'s development.'}
          </p>
        </header>

        {/* Filter Bar */}
        <div className="bg-stone-50 p-4 sm:p-6 border border-stone-200 mb-12 flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center z-20 relative">
          
          <div className="relative w-full sm:w-auto sm:min-w-[200px] min-w-0">
             <div className="text-[10px] uppercase tracking-tighter opacity-50 mb-2">
               {isGreek ? 'Ηλικια' : 'Age Range'}
             </div>
             <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                aria-label={isGreek ? 'Επιλογή ηλικίας' : 'Select age range'}
                className="w-full appearance-none rounded-none border border-stone-300 bg-stone-100 px-4 py-3 pr-10 text-xs font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-200 focus:outline-none focus:border-stone-900 cursor-pointer transition-colors"
              >
                <option value="">{isGreek ? 'Ολες οι Ηλικιες' : 'All Ages'}</option>
                {currentAgeRanges.map((range) => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500 pt-5">
                <ChevronDown className="h-4 w-4" />
              </div>
          </div>

          <div className="relative w-full sm:w-auto sm:min-w-[200px] min-w-0">
             <div className="text-[10px] uppercase tracking-tighter opacity-50 mb-2">
               {isGreek ? 'Κατηγορια' : 'Topic'}
             </div>
             <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label={isGreek ? 'Επιλογή κατηγορίας' : 'Select topic'}
                className="w-full appearance-none rounded-none border border-stone-300 bg-stone-100 px-4 py-3 pr-10 text-xs font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-200 focus:outline-none focus:border-stone-900 cursor-pointer transition-colors"
              >
                <option value="">{isGreek ? 'Ολες οι Κατηγοριες' : 'All Topics'}</option>
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500 pt-5">
                <ChevronDown className="h-4 w-4" />
              </div>
          </div>

          <div className="relative flex-1 w-full max-w-md sm:ml-auto mt-2 sm:mt-0 min-w-0">
            <div className="text-[10px] uppercase tracking-tighter opacity-50 mb-2">
               {isGreek ? 'Αναζητηση' : 'Search'}
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4 w-4 text-stone-400" />
              </div>
              <input
                type="search"
                aria-label={isGreek ? 'Αναζήτηση άρθρων' : 'Search articles'}
                placeholder={isGreek ? "Αναζήτηση..." : "Search articles..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-none border border-stone-300 bg-stone-100 py-3 pl-12 pr-4 text-xs font-bold uppercase tracking-widest text-stone-900 placeholder-stone-400 hover:bg-stone-200 focus:bg-white focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Article Grid / Hero */}
        {filteredArticles.length > 0 ? (
          <div>
            {!selectedAge && !selectedCategory && !searchQuery ? (
              <>
                <div className="mb-16">
                  <h2 className="font-serif text-3xl text-stone-900 mb-8 italic">
                    {isGreek ? 'Προτεινόμενα Άρθρα' : 'Recommended Articles'}
                  </h2>
                  <div className="flex flex-col border border-stone-200 bg-stone-200 gap-px">
                     {filteredArticles.slice(0, 3).length > 2 ? (
                       <>
                         {/* Hero Article */}
                         <ArticleCard article={filteredArticles[0]} featured={true} />
                         
                         {/* 2 Recommended under hero */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-200">
                             <ArticleCard article={filteredArticles[1]} />
                             <ArticleCard article={filteredArticles[2]} />
                         </div>
                       </>
                     ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-200">
                          {filteredArticles.slice(0, 3).map(article => (
                            <ArticleCard key={article.id} article={article} />
                          ))}
                       </div>
                     )}
                  </div>
                </div>

                {filteredArticles.length > 3 && (
                  <div>
                    <h2 className="text-[11px] uppercase tracking-[0.2em] mb-4 text-stone-600 font-medium border-t border-stone-200 pt-16">
                      {isGreek ? 'Όλα τα Νέα Άρθρα' : 'Latest Articles'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200 border border-stone-200">
                        {filteredArticles.slice(3).map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 border border-stone-200">
                {filteredArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 bg-stone-100 border border-stone-200">
            <p className="text-[11px] uppercase tracking-[0.2em] mb-4 text-stone-600 font-medium">
              {isGreek ? 'Δεν βρέθηκαν άρθρα' : 'No articles found'}
            </p>
            <p className="text-stone-500 text-sm mb-6">
               {isGreek ? 'Δοκιμάστε να αφαιρέσετε μερικά φίλτρα.' : 'Try removing some filters to see more results.'}
            </p>
            <button 
              onClick={() => { setSelectedAge(''); setSelectedCategory(''); setSearchQuery(''); }}
              className="inline-block border border-stone-900 px-6 py-2 text-[10px] uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-colors"
            >
              {isGreek ? 'Καθαρισμος' : 'Clear Filters'}
            </button>
          </div>
        )}

        <div className="mt-24 border-t border-stone-200 pt-16">
          <NewsletterBanner />
        </div>
      </main>
    </div>
  );
}
