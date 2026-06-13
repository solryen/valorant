import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../contexts/ArticleContext';
import { Article, CATEGORIES } from '../types';
import { ImagePlus, Loader2 } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { useAuth } from '../contexts/AuthContext';
import { exploreSupabaseAdminEmail } from '../lib/supabase';

export function NewArticlePage() {
  const navigate = useNavigate();
  const { addArticle } = useArticles();
  const { isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bodyMarkdown, setBodyMarkdown] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [language, setLanguage] = useState<'el' | 'en'>('en');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isInsertingImages, setIsInsertingImages] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="bg-amber-50 border border-amber-200 p-6 text-amber-900">
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-700 mb-3 font-medium">
              Locked
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 italic mb-4">
              {`8loop required`}
            </h1>
            <p className="text-sm leading-relaxed mb-6">
              {`8loop unlocks article publishing directly, but only ${exploreSupabaseAdminEmail} can create or publish articles.`}
            </p>
            <button
              type="button"
              onClick={() => navigate('/explore/admin')}
              className="inline-flex bg-stone-900 text-stone-50 py-3 px-6 text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fetchPexelsImage = async (query: string): Promise<string | null> => {
    try {
      const locale = language === 'el' ? 'el-GR' : 'en-US';
      const q = query.toLowerCase();
      // Enforce the requirement: prefer baby, parents, or scenery
      let searchQuery = query;
      if (!q.includes('baby') && !q.includes('μωρό') && !q.includes('parent') && !q.includes('γονείς') && !q.includes('toddler')) {
        searchQuery = `${query} baby parents`;
      }

      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=15&orientation=landscape&locale=${locale}`, {
        headers: {
          Authorization: "MsiwySszmWhgL2eMAyPKAsdXZtuIlNG0JVAuGf0fyCthXxcpHJ2AcPUL"
        }
      });
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
        return randomPhoto.src.large; 
      }
    } catch(e) {
      console.error("Failed to fetch from Pexels", e);
    }
    return null;
  };

  const handleAutoImages = async () => {
    setIsInsertingImages(true);
    try {
      let finalFeaturedImage = featuredImage;
      if (!finalFeaturedImage) {
        const url = await fetchPexelsImage(title || category);
        if (url) {
          setFeaturedImage(url);
          finalFeaturedImage = url;
        }
      }

      if (!bodyMarkdown.trim()) {
        if (finalFeaturedImage) {
          setBodyMarkdown(`![Featured Image](${finalFeaturedImage})\n\n`);
        }
        setIsInsertingImages(false);
        return;
      }

      const lines = bodyMarkdown.split('\n');
      let newLines: string[] = [];
      let wordCountSinceLastImage = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(/!\[.*?\]\(.*?\)/)) {
          newLines.push(line);
          wordCountSinceLastImage = 0;
          continue;
        }

        newLines.push(line);

        const words = line.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountSinceLastImage += words;

        const isSubheading = line.startsWith('## ') || line.startsWith('### ');

        // Check if upcoming lines have an image so we don't duplicate
        const nextLine1 = Array.from({length: 2}).map((_, j) => lines[i + 1 + j] || '').join('\n');
        const hasNextImage = nextLine1.match(/!\[.*?\]\(.*?\)/);

        if (isSubheading && !hasNextImage) {
          let query = line.replace(/#/g, '').trim();
          if (!query || query.length < 3) query = category;

          const imgUrl = await fetchPexelsImage(query);
          if (imgUrl) {
            newLines.push(`\n![${query}](${imgUrl})\n`);
          }
          wordCountSinceLastImage = 0;
        } else if (line.trim() === '' && wordCountSinceLastImage >= 150 && !hasNextImage) {
          const imgUrl = await fetchPexelsImage(category);
          if (imgUrl) {
            newLines.push(`![Relevant image](${imgUrl})\n`);
          }
          wordCountSinceLastImage = 0;
        }
      }

      setBodyMarkdown(newLines.join('\n'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsInsertingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'published' | 'draft') => {
    e.preventDefault();
    if (!title || !bodyMarkdown) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9α-ωάέήίόύώ\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const newArticle: Article = {
      id: Date.now().toString(),
      slug,
      language,
      title,
      subtitle,
      body_markdown: bodyMarkdown,
      category,
      baby_age_min: 0,
      baby_age_max: 24,
      author_name: 'Admin',
      expert_reviewed: false,
      published_at: new Date().toISOString(),
      status,
      featured_image_url: featuredImage || undefined,
    };

      try {
        await addArticle(newArticle);
      navigate(`/explore/${slug}`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to save article.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-10">
          <button 
            onClick={() => navigate('/explore/admin')}
            className="text-[10px] uppercase tracking-widest text-[#8B7E66] hover:text-stone-900 transition-colors"
          >
            ← Back to Admin
          </button>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 mt-4 italic">Publish New Article</h1>
        </div>

        <form className="space-y-8 bg-white p-5 sm:p-8 lg:p-12 border border-stone-200" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-stone-600 mb-2">Language</label>
              <div className="flex w-full border border-stone-300">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 p-3 text-xs uppercase tracking-widest font-medium transition-colors ${language === 'en' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('el')}
                  className={`flex-1 p-3 text-xs uppercase tracking-widest font-medium transition-colors border-l border-stone-300 ${language === 'el' ? 'bg-stone-900 text-stone-50' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
                >
                  Ελληνικά
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-stone-600 mb-2">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-stone-300 bg-stone-50 p-[14px] text-xs focus:border-stone-900 focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-600 mb-2">Article Structure</label>
            <select className="w-full border border-stone-300 bg-stone-50 p-[14px] text-xs focus:border-stone-900 focus:outline-none">
              <option value="practical">Practical Advice (1,000–1,800 words)</option>
              <option value="seo">SEO-Focused Guide (1,500–2,500 words)</option>
              <option value="ultimate">Deep Ultimate Guide (2,500–4,000+ words)</option>
            </select>
          </div>

          <div className="bg-[#EAE7E0] border border-[#E5E1D8] p-4 text-xs text-stone-700 leading-relaxed">
            <strong>Todayler Guidelines:</strong> Make sure the article is comprehensive. Add relevant images at the start and approximately every 300 words. Use clear paragraphs with subheadings (H2, H3) for readability.<br/><br/>
            <em>Note: Auto-images are decided using code by directly searching the Pexels API with your keywords, not by an AI model.</em>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-600 mb-2">Title *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Navigating the toddler years..."
              className="w-full border border-stone-300 bg-stone-50 p-4 text-sm font-serif italic focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-600 mb-2">Subtitle</label>
            <input 
              type="text" 
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="A brief compelling summary"
              className="w-full border border-stone-300 bg-stone-50 p-3 text-xs focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] uppercase tracking-widest text-stone-600">Featured Image URL (Title Image)</label>
              <button
                type="button"
                onClick={async () => {
                  const query = title || category;
                  setIsInsertingImages(true);
                  const url = await fetchPexelsImage(query);
                  if (url) setFeaturedImage(url);
                  setIsInsertingImages(false);
                }}
                disabled={isInsertingImages}
                className="text-[10px] uppercase tracking-widest text-stone-900 font-bold hover:underline disabled:opacity-50"
              >
                Auto-fill (Pexels)
              </button>
            </div>
            <input 
              type="text" 
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://images.pexels.com/... or leave empty to auto-fill on publish"
              className="w-full border border-stone-300 bg-stone-50 p-3 text-xs focus:border-stone-900 focus:outline-none"
            />
            {featuredImage && (
              <img src={featuredImage} alt="Featured" className="w-full h-48 object-cover mt-3 border border-stone-200" />
            )}
          </div>

          <div data-color-mode="light">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] uppercase tracking-widest text-stone-600">Body Content (Markdown) *</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleAutoImages}
                  disabled={isInsertingImages}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-900 font-bold bg-white border border-stone-200 hover:bg-stone-50 px-3 py-1.5 transition-colors disabled:opacity-50"
                  title="Uses Pexels API to automatically insert images at subheadings"
                >
                  {isInsertingImages ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Fetching...</>
                  ) : (
                    <><ImagePlus className="w-3 h-3" /> Auto-Images</>
                  )}
                </button>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium hidden sm:inline">
                  Words: {bodyMarkdown.trim() ? bodyMarkdown.trim().split(/\s+/).length : 0}
                </span>
              </div>
            </div>
            
            <MDEditor
              value={bodyMarkdown}
              onChange={(val) => setBodyMarkdown(val || '')}
              height={500}
              preview="live"
              className="w-full border border-stone-300 !font-sans"
            />
            
          </div>

          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row gap-4">
            <button 
              type="button" 
              onClick={(e) => handleSubmit(e, 'draft')}
              className="flex-1 bg-white border border-stone-300 text-stone-900 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-stone-50 transition-colors w-full"
            >
              Save as Draft
            </button>
            <button 
              type="button" 
              onClick={(e) => handleSubmit(e, 'published')}
              className="flex-1 bg-stone-900 text-stone-50 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors w-full"
            >
              Publish Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
