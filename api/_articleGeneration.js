import { GoogleGenAI, Type } from '@google/genai';

const ATHENS_TIME_ZONE = 'Europe/Athens';

function readEnv(env, ...names) {
  for (const name of names) {
    const value = env[name]?.trim();
    if (value) return value;
  }
  return '';
}

function getTimeZoneParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function getTimeZoneOffsetMinutes(date, timeZone) {
  const parts = getTimeZoneParts(date, timeZone);
  const asUtcMillis = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return (asUtcMillis - date.getTime()) / 60000;
}

function getTimeZoneWeekday(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
  }).format(date);
}

function convertTimeZoneWallTimeToUtc(parts, timeZone) {
  const utcGuess = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
  const initialOffsetMinutes = getTimeZoneOffsetMinutes(utcGuess, timeZone);
  const initialDate = new Date(utcGuess.getTime() - initialOffsetMinutes * 60000);
  const correctedOffsetMinutes = getTimeZoneOffsetMinutes(initialDate, timeZone);

  if (correctedOffsetMinutes !== initialOffsetMinutes) {
    return new Date(utcGuess.getTime() - correctedOffsetMinutes * 60000);
  }

  return initialDate;
}

function addDaysToDateParts(parts, days) {
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function getNextAthensPublishAt(index, generationDate) {
  const localParts = getTimeZoneParts(generationDate, ATHENS_TIME_ZONE);
  const scheduledDay = addDaysToDateParts({ year: localParts.year, month: localParts.month, day: localParts.day }, index + 1);

  return convertTimeZoneWallTimeToUtc(
    {
      year: scheduledDay.year,
      month: scheduledDay.month,
      day: scheduledDay.day,
      hour: 19,
      minute: 0,
      second: 0,
    },
    ATHENS_TIME_ZONE,
  ).toISOString();
}

export function isAthensSevenPm(date = new Date()) {
  const parts = getTimeZoneParts(date, ATHENS_TIME_ZONE);
  return parts.hour === 19 && parts.minute === 0;
}

export function isAthensSundayAtSevenPm(date = new Date()) {
  return getTimeZoneWeekday(date, ATHENS_TIME_ZONE) === 'Sun' && isAthensSevenPm(date);
}

function normalizeSlug(source) {
  return (
    source
      .toLowerCase()
      .replace(/[^a-z0-9α-ωάέήίόύώ\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || `article-${Date.now()}`
  );
}

async function fetchPexelsImage(query, env) {
  const apiKey = readEnv(env, 'PEXELS_API_KEY');
  if (!apiKey) {
    return 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
      },
    );

    if (!response.ok) {
      return 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
    }

    const data = await response.json();
    const firstPhoto = data.photos?.[0];
    return firstPhoto?.src?.large2x ?? firstPhoto?.src?.large ?? 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  } catch {
    return 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  }
}

export async function generateWeeklyArticles(env = process.env, generationDate = new Date()) {
  const geminiApiKey = readEnv(env, 'GEMINI_API_KEY', 'GEMINI_API');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY (or GEMINI_API) is required to generate weekly articles.');
  }

  const ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'todayler-explore',
      },
    },
  });

  const systemInstruction = `
You are Todayler's automated author. Generate 6 high-value articles for parents of 0-24 month old babies.

Requirements:
- Generate exactly 3 articles in Greek and 3 in English.
- Focus on SEO-driven parent search intent.
- Cover baby sleep, feeding, milestones, activities, and development.
- Keep the tone friendly, practical, and trustworthy.
- Return only JSON.

Return an array of objects with:
- title
- subtitle
- language ('el' or 'en')
- category
- baby_age_min
- baby_age_max
- body_markdown
- image_search_query
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: 'Generate the weekly Todayler article set now.',
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      toolConfig: { includeServerSideToolInvocations: true },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            language: { type: Type.STRING },
            category: { type: Type.STRING },
            baby_age_min: { type: Type.INTEGER },
            baby_age_max: { type: Type.INTEGER },
            body_markdown: { type: Type.STRING },
            image_search_query: { type: Type.STRING },
          },
          required: ['title', 'subtitle', 'language', 'category', 'baby_age_min', 'baby_age_max', 'body_markdown', 'image_search_query'],
        },
      },
    },
  });

  const generated = JSON.parse(response.text || '[]');
  const articles = [];

  for (const [index, item] of generated.entries()) {
    const featuredImageUrl = await fetchPexelsImage(item.image_search_query, env);
    const slug = normalizeSlug(item.title);
    articles.push({
      id: `ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      slug,
      language: item.language,
      title: item.title,
      subtitle: item.subtitle,
      body_markdown: item.body_markdown,
      category: item.category,
      baby_age_min: item.baby_age_min,
      baby_age_max: item.baby_age_max,
      tags: [item.category.toLowerCase(), item.language],
      featured_image_url: featuredImageUrl,
      author_name: 'Todayler AI Writer',
      authorId: 'gemini',
      expert_reviewed: false,
      published_at: getNextAthensPublishAt(index, generationDate),
      status: 'draft',
    });
  }

  return articles;
}

function mapGeneratedArticleToRow(article) {
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
    tags: Array.isArray(article.tags) ? article.tags.filter(Boolean) : [],
    featured_image_url: article.featured_image_url ?? null,
    author_name: article.author_name,
    author_id: article.authorId ?? null,
    expert_reviewed: article.expert_reviewed,
    published_at: article.published_at,
    status: article.status ?? 'draft',
  };
}

export async function persistGeneratedArticles(env, articles) {
  const supabaseUrl = readEnv(env, 'SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL').replace(/\/$/, '');
  const serviceRoleKey = readEnv(env, 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to persist generated articles.');
  }

  const payload = articles.map(mapGeneratedArticleToRow);
  const response = await fetch(`${supabaseUrl}/rest/v1/explore_articles?on_conflict=slug`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || 'Failed to persist generated articles.');
  }

  return await response.json();
}

export async function publishNextQueuedArticle(env = process.env) {
  const supabaseUrl = readEnv(env, 'SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL').replace(/\/$/, '');
  const serviceRoleKey = readEnv(env, 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to publish queued articles.');
  }

  const nowIso = new Date().toISOString();
  const listResponse = await fetch(
    `${supabaseUrl}/rest/v1/explore_articles?select=id,slug,published_at,author_id,author_name,status&status=eq.draft&author_id=eq.gemini&author_name=eq.Todayler%20AI%20Writer&published_at=lte.${encodeURIComponent(nowIso)}&order=published_at.asc&order=created_at.asc&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!listResponse.ok) {
    throw new Error((await listResponse.text()) || 'Failed to load queued articles.');
  }

  const queuedArticles = await listResponse.json();
  if (!queuedArticles.length) {
    return { published: 0, article: null };
  }

  const nextArticle = queuedArticles[0];
  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/explore_articles?id=eq.${encodeURIComponent(nextArticle.id)}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      status: 'published',
    }),
  });

  if (!updateResponse.ok) {
    throw new Error((await updateResponse.text()) || 'Failed to publish queued article.');
  }

  const updatedArticles = await updateResponse.json();
  return {
    published: 1,
    article: Array.isArray(updatedArticles) ? updatedArticles[0] ?? nextArticle : nextArticle,
  };
}

export async function verifyAdminSession(env, authorizationHeader) {
  const supabaseUrl = readEnv(env, 'SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL').replace(/\/$/, '');
  const supabaseAnonKey = readEnv(env, 'SUPABASE_ANON_KEY', 'EXPO_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');
  const adminEmail = readEnv(env, 'ARTICLE_ADMIN_EMAIL', 'EXPO_PUBLIC_SUPABASE_ADMIN_EMAIL', 'VITE_SUPABASE_ADMIN_EMAIL').toLowerCase();

  if (!supabaseUrl || !supabaseAnonKey || !adminEmail) {
    return { ok: false, status: 500, message: 'Generation proxy is not configured.' };
  }

  if (!authorizationHeader) {
    return { ok: false, status: 401, message: 'Missing authorization header.' };
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: authorizationHeader,
    },
  });

  if (!response.ok) {
    return { ok: false, status: 401, message: 'Invalid or expired admin session.' };
  }

  const user = await response.json();
  if ((user.email ?? '').trim().toLowerCase() !== adminEmail) {
    return { ok: false, status: 403, message: 'This account cannot generate articles.' };
  }

  return { ok: true };
}
