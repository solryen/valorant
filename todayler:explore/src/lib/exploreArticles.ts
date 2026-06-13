import {
  supabase,
  exploreSupabaseAdminEmail,
  isSupabaseConfigured,
} from './supabase';
import type { Article } from '../types';

export type ExploreArticleRow = {
  id: string;
  slug: string;
  language: 'el' | 'en';
  title: string;
  subtitle: string | null;
  body_markdown: string;
  category: string;
  baby_age_min: number;
  baby_age_max: number;
  tags: string[] | null;
  featured_image_url: string | null;
  author_name: string;
  author_id: string | null;
  expert_reviewed: boolean;
  published_at: string;
  status: 'published' | 'draft';
};

export type ArticleSyncAction = 'list' | 'upsert' | 'delete';

export interface ArticleSyncPayload {
  action: ArticleSyncAction;
  article?: Article;
}

function normalizeTags(tags: string[] | undefined): string[] {
  return Array.isArray(tags) ? tags.filter(Boolean) : [];
}

export function mapExploreRowToArticle(row: ExploreArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    language: row.language,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    body_markdown: row.body_markdown,
    category: row.category,
    baby_age_min: row.baby_age_min,
    baby_age_max: row.baby_age_max,
    tags: normalizeTags(row.tags ?? undefined),
    featured_image_url: row.featured_image_url ?? undefined,
    author_name: row.author_name,
    authorId: row.author_id ?? undefined,
    expert_reviewed: row.expert_reviewed,
    published_at: row.published_at,
    status: row.status,
  };
}

export function mapArticleToRow(article: Article): Omit<ExploreArticleRow, 'id'> & { id?: string } {
  return {
    id: article.id,
    slug: article.slug,
    language: article.language,
    title: article.title,
    subtitle: article.subtitle ?? null,
    body_markdown: article.body_markdown,
    category: article.category,
    baby_age_min: article.baby_age_min,
    baby_age_max: article.baby_age_max,
    tags: normalizeTags(article.tags),
    featured_image_url: article.featured_image_url ?? null,
    author_name: article.author_name,
    author_id: article.authorId ?? null,
    expert_reviewed: article.expert_reviewed,
    published_at: article.published_at,
    status: article.status ?? 'published',
  };
}

export function isExploreArticleIdRemote(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function isExploreSupabaseReady(): boolean {
  return isSupabaseConfigured && Boolean(supabase);
}

export async function fetchPublishedExploreArticles(): Promise<Article[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('explore_articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapExploreRowToArticle(row as ExploreArticleRow));
}

export async function fetchAllExploreArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured) return [];

  const { data: sessionData } = await supabase!.auth.getSession();
  const accessToken = sessionData.session?.access_token ?? '';
  if (!accessToken) {
    throw new Error('Admin session is required to load draft articles.');
  }

  const response = await fetch('/api/article-sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ action: 'list' }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to load admin articles.');
  }

  const payload = (await response.json()) as { articles?: ExploreArticleRow[] };
  return (payload.articles ?? []).map((row) => mapExploreRowToArticle(row));
}

export async function sendArticleMutation(payload: ArticleSyncPayload): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token ?? '';
  if (!accessToken) {
    throw new Error(
      exploreSupabaseAdminEmail
        ? `Please sign in with ${exploreSupabaseAdminEmail} before saving articles.`
        : `Please sign in with ${exploreSupabaseAdminEmail || 'the configured admin email'} before saving articles.`,
    );
  }

  const response = await fetch('/api/article-sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Article sync failed.');
  }
}

export function subscribeToExploreArticleChanges(onChange: () => void) {
  if (!supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('explore_articles_public_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'explore_articles',
      },
      () => {
        onChange();
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export function mergeExploreArticles(remoteArticles: Article[], seedArticles: Article[], hiddenSeedSlugs: string[]) {
  const remoteBySlug = new Map(remoteArticles.map((article) => [article.slug, article]));
  const merged = [...remoteArticles];

  for (const seedArticle of seedArticles) {
    if (remoteBySlug.has(seedArticle.slug)) continue;
    if (hiddenSeedSlugs.includes(seedArticle.slug)) continue;
    merged.push(seedArticle);
  }

  return merged.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}
