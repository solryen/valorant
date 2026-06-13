import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { NewsletterInline } from '../components/NewsletterInline';
import { ArticleCard } from '../components/ArticleCard';
import { useArticles } from '../contexts/ArticleContext';
import { Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles } = useArticles();
  const { language } = useLanguage();
  const isGreek = language === 'el';
  
  // Try to find the article in our context data
  const article = articles.find(a => a.slug === slug);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          {isGreek ? 'Το άρθρο δεν βρέθηκε' : 'Article not found'}
        </h1>
        <Link to="/explore" className="mt-4 text-[10px] uppercase font-bold tracking-widest text-orange-600 hover:text-stone-900 transition-colors">
          {isGreek ? 'Επιστροφή στην Αρχική' : 'Back to explore'}
        </Link>
      </div>
    );
  }

  const dateStr = new Date(article.published_at).toLocaleDateString(isGreek ? 'el-GR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category && a.status !== 'draft' && a.language === article.language)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 3);

  if (relatedArticles.length < 3) {
      // fallback to any
      const more = articles
        .filter(a => a.id !== article.id && a.status !== 'draft' && a.language === article.language && !relatedArticles.includes(a))
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        .slice(0, 3 - relatedArticles.length);
      relatedArticles.push(...more);
  }

  // Extract headings for Table of Contents
  const headings = article.body_markdown
    .split('\n')
    .filter(line => line.startsWith('## ') || line.startsWith('### '))
    .map(line => {
      const level = line.startsWith('### ') ? 3 : 2;
      const text = line.replace(/^#+\s/, '').trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return { level, text, id };
    });

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(isGreek ? "Ο σύνδεσμος αντιγράφηκε!" : "Link copied to clipboard!");
  };

  return (
    <article className="min-h-screen bg-stone-50 pb-20 border-t border-stone-200">
      <Helmet>
        <title>{article.title} | Todayler</title>
        <meta name="description" content={article.subtitle} />
        <link rel="canonical" href={`https://todayler.com/explore/${article.slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.subtitle} />
        {article.featured_image_url && <meta property="og:image" content={article.featured_image_url} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.published_at} />
        <meta property="article:author" content={article.author_name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.subtitle} />
        {article.featured_image_url && <meta name="twitter:image" content={article.featured_image_url} />}
      </Helmet>
      
      {article.status === 'draft' && (
        <div className="bg-amber-100 text-amber-900 px-6 py-3 text-center text-[10px] uppercase tracking-widest font-bold">
          {isGreek ? 'Αυτό το άρθρο είναι προσχέδιο και δεν είναι ορατό στο κοινό.' : 'This article is a draft and is not visible to the public.'}
        </div>
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.subtitle,
            "image": article.featured_image_url ? [article.featured_image_url] : [],
            "datePublished": article.published_at,
            "author": [{
              "@type": "Person",
              "name": article.author_name
            }],
            "publisher": {
              "@type": "Organization",
              "name": "Todayler"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Todayler",
                "item": "https://todayler.com/explore"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": article.category,
                "item": `https://todayler.com/explore?category=${encodeURIComponent(article.category)}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `https://todayler.com/explore/${article.slug}`
              }
            ]
          }
        ])}
      </script>

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-10 py-5 sm:py-6 text-[9px] uppercase tracking-widest text-stone-500 font-medium flex flex-wrap gap-x-2 gap-y-1 items-center">
        <Link to="/explore" className="hover:text-orange-600 transition-colors">Todayler</Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-orange-600 transition-colors">{isGreek ? 'ΕΞΕΡΕΥΝΗΣΗ' : 'EXPLORE'}</Link>
        <span>/</span>
        <span className="text-stone-900">{article.category}</span>
      </div>

      {/* Featured Header Zone */}
      <header className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 text-center">
        <div className="inline-block px-2 py-1 bg-orange-600 text-white text-[9px] uppercase tracking-widest w-fit mb-4 sm:mb-6">
          {article.category}
        </div>
        
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-stone-900 mb-6 sm:mb-8 italic max-w-[11ch] mx-auto">
          {article.title}
        </h1>

        {article.subtitle && (
           <p className="text-base sm:text-lg lg:text-xl text-stone-700 opacity-90 max-w-[700px] mx-auto leading-relaxed mb-6 sm:mb-8">
             {article.subtitle}
           </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.2em] font-medium text-stone-600">
          <span>By {article.author_name}</span>
          <span className="w-1 h-1 rounded-full bg-stone-400"></span>
          <time dateTime={article.published_at}>{dateStr}</time>
          <span className="w-1 h-1 rounded-full bg-stone-400"></span>
          <span>{article.baby_age_min}–{article.baby_age_max} {isGreek ? 'μηνών' : 'months'}</span>
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image_url && (
         <div className="w-full max-w-[1200px] mx-auto relative aspect-[16/10] sm:aspect-[21/9] bg-stone-200 border-y sm:border border-stone-200 mb-12 sm:mb-16 overflow-hidden">
            <img 
               src={article.featured_image_url} 
               alt={article.title}
               fetchPriority="high"
               decoding="async"
               className="w-full h-full object-cover grayscale-[20%] contrast-110"
            />
         </div>
      )}

      {/* Body Content with Layout */}
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10 sm:gap-12 lg:gap-16 items-start">
        <div className="min-w-0">
          
          {article.expert_reviewed && (
            <div className="mb-10 p-5 sm:p-6 bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <span className="font-serif italic text-base sm:text-lg text-stone-900">Expert Reviewed</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600">
                {isGreek ? 'Ελεγμένο από Παιδίατρο' : 'Reviewed by Pediatrician'}
              </span>
            </div>
          )}

          {/* Subtle Inline Promo */}
          <div className="mb-10 bg-[#EAE7E0]/40 border-l-2 border-orange-600 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-medium text-orange-600 mb-1">
                {isGreek ? 'ΕΞΑΤΟΜΙΚΕΥΜΕΝΗ ΚΑΘΟΔΗΓΗΣΗ' : 'PERSONALIZED GUIDANCE'}
              </span>
              <p className="text-sm sm:text-base font-serif italic text-stone-900">
                {isGreek 
                  ? 'Θέλετε εξατομικευμένες συμβουλές όπως αυτές κάθε μέρα; Κατεβάστε την εφαρμογή.' 
                  : 'Want to get personalised advice like this every day? Download our app.'}
              </p>
            </div>
            <a
              href="https://apps.apple.com/gr/app/todayler-baby-tracker/id6761668150"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-stone-900 text-stone-50 px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
            >
              {isGreek ? 'Ληψη Εφαρμογης' : 'Download App'}
            </a>
          </div>

          <div className="prose max-w-none">
             <Markdown
               components={{
                h2: ({node, ...props}) => {
                  const text = String(props.children);
                  const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h2 id={id} className="scroll-mt-24" {...props} />;
                },
                h3: ({node, ...props}) => {
                  const text = String(props.children);
                  const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h3 id={id} className="scroll-mt-24" {...props} />;
                },
                img: ({node, ...props}) => (
                  <span className="block my-8 overflow-hidden bg-stone-100 border border-stone-200">
                    <img {...props} loading="lazy" className="w-full h-auto object-cover max-h-[500px] m-0 grayscale-[10%] contrast-105" />
                  </span>
                )
               }}
             >
               {article.body_markdown}
             </Markdown>
          </div>
          
          {/* Author Bio Section */}
          <div className="mt-16 bg-stone-100 border border-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            <div className="w-16 h-16 bg-stone-300 rounded-full flex-shrink-0 flex items-center justify-center text-stone-500 font-serif text-2xl italic">
              {article.author_name.charAt(0)}
            </div>
            <div>
              <h4 className="font-serif text-xl text-stone-900 mb-2">{article.author_name}</h4>
              <p className="text-sm text-stone-600 leading-relaxed font-light mb-4">
                {isGreek 
                  ? 'Η Ομάδα Todayler αποτελείται από ειδικούς ανάπτυξης παιδιών, παιδιάτρους και έμπειρους γονείς αφοσιωμένους στο να προσφέρουν αξιόπιστες συμβουλές για την εγκυμοσύνη και τη φροντίδα των μωρών.' 
                  : 'The Todayler Team consists of child development experts, pediatricians, and experienced parents dedicated to bringing you trustworthy advice on baby development and parenting.'}
              </p>
              {article.expert_reviewed && (
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {isGreek ? 'Περιεχόμενο ελεγμένο από ιατρούς' : 'Medical Review Passed'}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Share Buttons (Mobile primarily) */}
          <div className="mt-8 pt-8 border-t border-stone-200 flex sm:hidden items-center justify-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium mr-2">{isGreek ? 'ΚΟΙΝΟΠΟΙΗΣΗ' : 'SHARE'}</span>
            <button title="Facebook" className="p-2 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-600"><Facebook className="w-4 h-4" /></button>
            <button title="Twitter" className="p-2 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-600"><Twitter className="w-4 h-4" /></button>
            <button onClick={copyLink} title="Copy Link" className="p-2 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-600"><LinkIcon className="w-4 h-4" /></button>
          </div>

          <div className="mt-20 pt-16 border-t border-stone-200">
             {/* CTA Block */}
             <div className="bg-[#EAE7E0] border border-[#E5E1D8] p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10 mt-12 mb-12">
                <div className="text-center sm:text-left">
                  <div className="text-[10px] uppercase tracking-[0.2em] mb-4 text-[#8B7E66] font-medium">Get the App</div>
                  <h3 className="font-serif text-2xl sm:text-3xl mb-3 italic">Todayler</h3>
                  <p className="text-sm opacity-80 max-w-sm">
                    {isGreek ? "Παρακολουθήστε κάθε ορόσημο και βρείτε δραστηριότητες ειδικά για την ηλικία του μωρού σας — δωρεάν." : "Track milestones, get daily activities perfectly timed for your baby's age."}
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                   <a href="https://apps.apple.com/gr/app/todayler-baby-tracker/id6761668150" target="_blank" rel="noopener noreferrer" className="bg-white text-stone-900 border border-stone-200 px-8 py-4 text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-colors text-center block w-full sm:w-auto font-bold">
                     {isGreek ? 'Λήψη Εφαρμογής' : 'Download on App Store'}
                   </a>
                </div>
             </div>
          </div>

          <NewsletterInline />

        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-32">
          {/* Table of Contents */}
          {headings.length > 0 && (
            <div className="mb-12">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-900 mb-6 pb-4 border-b border-stone-200">
                {isGreek ? 'ΣΕ ΑΥΤΟ ΤΟ ΑΡΘΡΟ' : 'IN THIS ARTICLE'}
              </h4>
              <nav className="flex flex-col gap-3">
                {headings.map((h, i) => (
                  <a 
                    key={i} 
                    href={`#${h.id}`}
                    className={`text-sm hover:text-orange-600 transition-colors line-clamp-2 ${h.level === 3 ? 'ml-4 text-stone-500' : 'text-stone-700 font-medium'}`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Desktop Share Buttons */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-900 mb-6 pb-4 border-b border-stone-200">
              {isGreek ? 'ΚΟΙΝΟΠΟΙΗΣΗ' : 'SHARE'}
            </h4>
            <div className="flex gap-3">
              <button title="Facebook" className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:bg-stone-100 transition-colors text-stone-600"><Facebook className="w-4 h-4" /></button>
              <button title="Twitter" className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:bg-stone-100 transition-colors text-stone-600"><Twitter className="w-4 h-4" /></button>
              <button onClick={copyLink} title="Copy Link" className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:bg-stone-100 transition-colors text-stone-600"><LinkIcon className="w-4 h-4" /></button>
            </div>
          </div>
        </aside>

      </div>

      <div className="border-t border-stone-200 mt-20 bg-stone-100 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
           <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-10 sm:mb-12 italic">
             {article.language === 'en' ? 'Related Articles' : 'Διαβάστε επίσης'}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200 border border-stone-200">
              {relatedArticles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
        </div>
      </div>

    </article>
  );
}
