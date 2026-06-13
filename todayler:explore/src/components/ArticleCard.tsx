import React, { useState } from 'react';
import { Article } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { language } = useLanguage();
  
  const dateStr = new Date(article.published_at).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (featured) {
    return (
      <Link to={`/explore/${article.slug}`} className="group flex flex-col md:flex-row overflow-hidden bg-stone-100 hover:bg-[#FDFBF7] transition-colors duration-300">
         <div className="relative md:w-3/5 aspect-[4/3] md:aspect-auto md:min-h-[460px] overflow-hidden bg-stone-200">
            {article.featured_image_url && (
              <img
                src={article.featured_image_url}
                alt={article.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
            )}
         </div>
         <div className="flex flex-col flex-1 p-6 sm:p-8 md:p-12 justify-center border-l border-stone-200">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block px-2 py-1 bg-orange-600 text-white text-[9px] w-fit uppercase tracking-widest">
                {language === 'el' ? 'ΝΕΟΤΕΡΟ' : 'LATEST'}
              </span>
              <span className="inline-block px-2 py-1 border border-stone-600 text-stone-900 text-[9px] uppercase tracking-widest">
                {article.baby_age_min}–{article.baby_age_max} {language === 'el' ? 'μηνών' : 'months'}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-5xl leading-tight text-stone-900 mb-5 sm:mb-6 group-hover:text-orange-600 transition-colors">
              {article.title}
            </h3>
            {article.subtitle && (
                <p className="text-sm text-stone-600 leading-relaxed mb-8 line-clamp-3">
                  {article.subtitle}
                </p>
            )}
            <time dateTime={article.published_at} className="mt-auto text-[10px] uppercase font-bold tracking-widest opacity-60">
              {dateStr}
            </time>
         </div>
      </Link>
    );
  }

  return (
    <Link to={`/explore/${article.slug}`} className="group flex flex-col overflow-hidden bg-stone-100 hover:bg-[#FDFBF7] transition-colors duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        {article.featured_image_url ? (
          <img
            src={article.featured_image_url}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover grayscale-[30%] contrast-125 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-stone-200" />
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-block px-2 py-1 bg-stone-600 text-white text-[9px] uppercase tracking-widest">
            {article.category}
          </span>
          <span className="inline-block px-2 py-1 border border-stone-600 text-stone-900 text-[9px] uppercase tracking-widest">
            {article.baby_age_min}–{article.baby_age_max} {language === 'el' ? 'μηνών' : 'months'}
          </span>
        </div>
        <h3 className="font-serif text-xl sm:text-3xl leading-tight text-stone-900 mb-4 group-hover:text-orange-600 transition-colors">
          {article.title}
        </h3>
        <time dateTime={article.published_at} className="mt-auto text-[10px] uppercase font-bold tracking-widest opacity-60">
          {dateStr}
        </time>
      </div>
    </Link>
  );
}
