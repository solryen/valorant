import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import {
  generateWeeklyArticles,
  isAthensSevenPm,
  isAthensSundayAtSevenPm,
  persistGeneratedArticles,
  publishNextQueuedArticle,
  verifyAdminSession,
} from './api/_articleGeneration';

function normalizeBasePath(basePath: string | undefined) {
  const trimmedBasePath = (basePath ?? '').trim();

  if (!trimmedBasePath || trimmedBasePath === '/') {
    return '/';
  }

  const withLeadingSlash = trimmedBasePath.startsWith('/') ? trimmedBasePath : `/${trimmedBasePath}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function triggerArticleGenerationPlugin(runtimeEnv: NodeJS.ProcessEnv) {
  return {
    name: 'trigger-article-generation-dev',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url || !req.method) {
          next();
          return;
        }

        const requestUrl = new URL(req.url, 'http://localhost');
        if (requestUrl.pathname !== '/api/trigger-article-generation') {
          next();
          return;
        }

        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };

        if (req.method !== 'GET' && req.method !== 'POST') {
          send(405, { error: 'Method not allowed.' });
          return;
        }

        if (req.method === 'POST') {
          const authCheck = await verifyAdminSession(runtimeEnv, req.headers.authorization ?? null);
          if (!authCheck.ok) {
            send(authCheck.status, { error: authCheck.message });
            return;
          }
        } else if (requestUrl.searchParams.get('source') !== 'cron') {
          send(400, { error: 'This endpoint only accepts POST or the cron trigger.' });
          return;
        } else if (!isAthensSundayAtSevenPm()) {
          send(200, { success: true, skipped: true, reason: 'Outside the weekly generation window.' });
          return;
        }

        try {
          const articles = await generateWeeklyArticles(runtimeEnv);
          await persistGeneratedArticles(runtimeEnv, articles);
          send(200, {
            success: true,
            count: articles.length,
            articles,
          });
        } catch (error) {
          send(500, {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown article generation failure.',
          });
        }
      });
    },
  };
}

function publishQueuedArticlePlugin(runtimeEnv: NodeJS.ProcessEnv) {
  return {
    name: 'publish-queued-article-dev',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url || !req.method) {
          next();
          return;
        }

        const requestUrl = new URL(req.url, 'http://localhost');
        if (requestUrl.pathname !== '/api/publish-queued-articles') {
          next();
          return;
        }

        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };

        if (req.method !== 'GET' && req.method !== 'POST') {
          send(405, { error: 'Method not allowed.' });
          return;
        }

        if (req.method === 'POST') {
          const authCheck = await verifyAdminSession(runtimeEnv, req.headers.authorization ?? null);
          if (!authCheck.ok) {
            send(authCheck.status, { error: authCheck.message });
            return;
          }
        } else if (requestUrl.searchParams.get('source') !== 'cron') {
          send(400, { error: 'This endpoint only accepts POST or the cron trigger.' });
          return;
        } else if (!isAthensSevenPm()) {
          send(200, { success: true, skipped: true, reason: 'Outside the daily publish window.' });
          return;
        }

        try {
          const result = await publishNextQueuedArticle(runtimeEnv);
          send(200, {
            success: true,
            ...result,
          });
        } catch (error) {
          send(500, {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown queued publish failure.',
          });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const runtimeEnv = { ...env, ...process.env };
  const base = normalizeBasePath(runtimeEnv.VITE_BASE_PATH ?? runtimeEnv.BASE_PATH);
  const supabaseUrl = (
    runtimeEnv.SUPABASE_URL ??
    runtimeEnv.EXPO_PUBLIC_SUPABASE_URL ??
    runtimeEnv.VITE_SUPABASE_URL ??
    ''
  ).trim().replace(/\/$/, '');

  return {
    base,
    envPrefix: ['VITE_', 'EXPO_PUBLIC_', 'ARTICLE_'],
    plugins: [triggerArticleGenerationPlugin(runtimeEnv), publishQueuedArticlePlugin(runtimeEnv), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: runtimeEnv.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: runtimeEnv.DISABLE_HMR === 'true' ? null : {},
      fs: {
        strict: false,
        allow: [path.resolve(__dirname, '..')],
      },
      proxy: supabaseUrl
        ? {
            '/api/article-sync': {
              target: supabaseUrl,
              changeOrigin: true,
              rewrite: () => '/functions/v1/article-sync',
            },
          }
        : undefined,
    },
  };
});
