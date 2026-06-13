import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import cron from "node-cron";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
// We use process.env.GEMINI_API_KEY injected by the environment.
const ai = new GoogleGenAI({
  // The SDK automatically uses process.env.GEMINI_API_KEY
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const app = express();
const PORT = 3000;

app.use(express.json());

const DB_PATH = path.join(process.cwd(), "src/data/ai-articles.json");

function getGeneratedArticles() {
  if (fs.existsSync(DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveGeneratedArticles(articles: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(articles, null, 2));
}

// Ensure the file exists
if (!fs.existsSync(DB_PATH)) {
  saveGeneratedArticles([]);
}

async function fetchPexelsImage(query: string) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: '9yPrm1XwR2GZcT412a4mEQc7N8V33Vd0N3gH88n0T87N0v18Q3J1D1x9'
      }
    });
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large2x;
    }
  } catch (err) {
    console.error("Pexels error:", err);
  }
  return 'https://images.pexels.com/photos/17225949/pexels-photo-17225949.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
}

async function generateWeeklyArticles() {
  console.log("Starting weekly article generation with Gemini...");
  
  const rules = `
You are Todayler's automated author. You must generate 6 highly relevant, SEO-driven articles for parents of 0-24 month old babies.
- 3 articles strictly in GREEK.
- 3 articles strictly in ENGLISH.

Guidelines (The Todayler Code):
1. PARENT QUESTIONS & SEARCH INTENT: Target the most searched questions and pain points of parents with 0-2 year olds (e.g., "how to sleep longer with a 1 month old baby"). Maximize value for Google search and AI search engines by directly answering these questions.
2. CONTENT PILLARS: Cover developmental milestones, actionable parent questions, and age-specific activity suggestions. 
3. SCIENTIFICALLY BACKED: Ensure all advice is medically and developmentally sound. ALL activity suggestions MUST be aligned with and approved by trusted sources like the CDC or Pathways.org. No errors allowed.
4. COMPREHENSIVE & STRUCTURED: Each article must be relatively long, have clear H2 (##) and H3 (###) headings, bullet points, and actionable tips.
5. TONE: Friendly, empathetic, encouraging, "Todayler Coded" (trusted sources, supportive tone for tired parents).
6. TODAYLER APP MENTION: At the very end of each article, seamlessly include a short sentence mentioning that the Todayler app can help parents keep track of everything (milestones, sleep, activities, etc.) without overwhelming them. Ensure this mention actively relates to the topic of the article so it feels organic and SEO-friendly.

Generate the articles in JSON format containing an array of objects. Do not include markdown blocks outside the JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate the 6 weekly articles based on the rules. Return only the JSON array of articles.",
      config: {
        systemInstruction: rules,
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "SEO optimized title" },
              subtitle: { type: Type.STRING, description: "Short descriptive subtitle" },
              language: { type: Type.STRING, description: "'el' for Greek, 'en' for English" },
              category: { type: Type.STRING, description: "Main category short word, e.g. Sleep, Nutrition, Milestones" },
              baby_age_min: { type: Type.INTEGER, description: "Minimum applicable month (0-24)" },
              baby_age_max: { type: Type.INTEGER, description: "Maximum applicable month (0-24)" },
              body_markdown: { type: Type.STRING, description: "Full article body in comprehensive markdown. Use ## and ### headings." },
              image_search_query: { type: Type.STRING, description: "A simple English query to find a featured image on Pexels (e.g. 'sleeping newborn', 'baby eating broccoli')" }
            },
            required: ["title", "subtitle", "language", "category", "baby_age_min", "baby_age_max", "body_markdown", "image_search_query"]
          }
        }
      }
    });

    const articlesData = JSON.parse(response.text || "[]");
    
    // Process them, assign IDs, fetch images
    const processedArticles = [];
    for (const data of articlesData) {
      const id = `ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || id;
      
      const featured_image_url = await fetchPexelsImage(data.image_search_query);

      processedArticles.push({
        id,
        slug,
        language: data.language,
        title: data.title,
        subtitle: data.subtitle,
        body_markdown: data.body_markdown,
        category: data.category,
        baby_age_min: data.baby_age_min,
        baby_age_max: data.baby_age_max,
        featured_image_url,
        author_name: 'Todayler AI Writer',
        authorId: 'gemini',
        status: 'published',
        expert_reviewed: false,
        published_at: new Date().toISOString()
      });
    }

    const currentDB = getGeneratedArticles();
    const updatedDB = [...processedArticles, ...currentDB];
    saveGeneratedArticles(updatedDB);
    
    console.log(`Generated ${processedArticles.length} articles successfully!`);
    return processedArticles;

  } catch (error) {
    console.error("Failed to generate articles:", error);
    throw error;
  }
}

// Cron Job: Run at 7 PM (19:00) every Sunday in Greek Time (Athens)
cron.schedule("0 19 * * 0", () => {
  generateWeeklyArticles().catch(console.error);
}, {
  timezone: "Europe/Athens"
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

import { articles as initialArticles } from "./src/data/articles";

app.get('/sitemap.xml', (req, res) => {
  const dynamicArticles = getGeneratedArticles();
  const allArticles = [...initialArticles, ...dynamicArticles];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://todayler.com/explore</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

  const seenSlugs = new Set();
  allArticles.forEach(a => {
    if (a.status !== 'published') return;
    if (seenSlugs.has(a.slug)) return;
    seenSlugs.add(a.slug);
    
    sitemap += `
  <url>
    <loc>https://todayler.com/explore/${a.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });
  
  sitemap += `\n</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: https://todayler.com/sitemap.xml
`);
});

app.get("/api/ai-articles", (req, res) => {
  const articles = getGeneratedArticles();
  res.json(articles);
});

// Manual trigger for testing
app.post("/api/trigger-article-generation", async (req, res) => {
  try {
    const articles = await generateWeeklyArticles();
    res.json({ success: true, count: articles.length, articles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
