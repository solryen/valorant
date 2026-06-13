import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Article } from '../types';
import { articles as seedArticles } from '../data/articles';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import {
  fetchAllExploreArticles,
  fetchPublishedExploreArticles,
  isExploreArticleIdRemote,
  mergeExploreArticles,
  sendArticleMutation,
  subscribeToExploreArticleChanges,
} from '../lib/exploreArticles';

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (id: string, updates: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  triggerAIGeneration: () => Promise<{ count: number }>;
  isGenerating: boolean;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);
const hiddenSeedSlugsStorageKey = 'todayler_hidden_seed_articles';

function readHiddenSeedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(hiddenSeedSlugsStorageKey);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

function writeHiddenSeedSlugs(slugs: string[]) {
  localStorage.setItem(hiddenSeedSlugsStorageKey, JSON.stringify(slugs));
}

function normalizeArticle(article: Article): Article {
  return {
    ...article,
    tags: article.tags ? [...article.tags] : undefined,
    status: article.status ?? 'published',
  };
}

function removeHiddenSeedSlug(slugs: string[], slug: string) {
  return slugs.filter((hiddenSlug) => hiddenSlug !== slug);
}

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [remoteArticles, setRemoteArticles] = useState<Article[]>([]);
  const [hiddenSeedSlugs, setHiddenSeedSlugs] = useState<string[]>(() => readHiddenSeedSlugs());
  const [isGenerating, setIsGenerating] = useState(false);

  const refreshArticles = useCallback(async () => {
    if (!supabase) {
      setRemoteArticles([]);
      return;
    }

    try {
      if (isAdmin) {
        setRemoteArticles(await fetchAllExploreArticles());
      } else {
        setRemoteArticles(await fetchPublishedExploreArticles());
      }
    } catch {
      setRemoteArticles([]);
    }
  }, [isAdmin]);

  useEffect(() => {
    void refreshArticles();
  }, [refreshArticles]);

  useEffect(() => {
    if (!supabase) return;

    const unsubscribe = subscribeToExploreArticleChanges(() => {
      void refreshArticles();
    });

    return unsubscribe;
  }, [refreshArticles]);

  const articles = useMemo(
    () => mergeExploreArticles(remoteArticles, seedArticles, hiddenSeedSlugs),
    [remoteArticles, hiddenSeedSlugs],
  );

  const addArticle = async (article: Article) => {
    const normalizedArticle = normalizeArticle(article);
    await sendArticleMutation({
      action: 'upsert',
      article: normalizedArticle,
    });
    const nextHidden = removeHiddenSeedSlug(hiddenSeedSlugs, normalizedArticle.slug);
    if (nextHidden.length !== hiddenSeedSlugs.length) {
      setHiddenSeedSlugs(nextHidden);
      writeHiddenSeedSlugs(nextHidden);
    }
    await refreshArticles();
  };

  const updateArticle = async (id: string, updates: Partial<Article>) => {
    const currentArticle = articles.find((article) => article.id === id);
    if (!currentArticle) {
      throw new Error('Article not found.');
    }

    await sendArticleMutation({
      action: 'upsert',
      article: normalizeArticle({
        ...currentArticle,
        ...updates,
        slug: updates.slug ?? currentArticle.slug,
      }),
    });

    await refreshArticles();
  };

  const deleteArticle = async (id: string) => {
    const currentArticle = articles.find((article) => article.id === id);
    if (!currentArticle) return;

    try {
      await sendArticleMutation({
        action: 'delete',
        article: currentArticle,
      });
    } catch {
      // Seed fallback rows may not exist in Supabase. We still hide them locally.
    }

    if (!isExploreArticleIdRemote(currentArticle.id) || seedArticles.some((seedArticle) => seedArticle.slug === currentArticle.slug)) {
      const nextHidden = hiddenSeedSlugs.includes(currentArticle.slug)
        ? hiddenSeedSlugs
        : [...hiddenSeedSlugs, currentArticle.slug];
      setHiddenSeedSlugs(nextHidden);
      writeHiddenSeedSlugs(nextHidden);
    }

    await refreshArticles();
  };

  const triggerAIGeneration = async () => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    setIsGenerating(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token ?? '';
    if (!accessToken) {
      setIsGenerating(false);
      throw new Error('Admin session is required to generate articles.');
    }

    try {
      const response = await fetch('/api/trigger-article-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Weekly article generation failed.');
      }

      const payload = (await response.json()) as { count?: number };
      await refreshArticles();
      return { count: payload.count ?? 0 };
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ArticleContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle, triggerAIGeneration, isGenerating }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
}
