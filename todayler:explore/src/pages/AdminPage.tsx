import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../contexts/ArticleContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { exploreSupabaseAdminEmail } from '../lib/supabase';
import { Trash2, Eye, EyeOff, Bot } from 'lucide-react';

export function AdminPage() {
  const { articles, updateArticle, deleteArticle, triggerAIGeneration, isGenerating } = useArticles();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const isGreek = language === 'el';

  const [activeTab, setActiveTab] = React.useState<'all' | 'drafts'>('all');

  const handleDelete = async (id: string) => {
    if (window.confirm(isGreek ? 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το άρθρο οριστικά;' : 'Are you sure you want to permanently delete this article?')) {
      try {
        await deleteArticle(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete article.');
      }
    }
  };

  const handleTriggerGeneration = async () => {
    try {
      await triggerAIGeneration();
      alert(isGreek ? 'Δημιουργήθηκε η εβδομαδιαία ουρά άρθρων.' : 'The weekly article queue has been generated.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate articles.');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateArticle(id, { status: newStatus });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update article.');
    }
  };

  const displayedArticles = activeTab === 'all' 
    ? articles 
    : articles.filter(a => a.status === 'draft');

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] bg-stone-50 flex flex-col p-4 sm:p-6 lg:p-16">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 p-6 text-amber-900">
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-700 mb-3 font-medium">
              {isGreek ? 'Κλειδωμένο' : 'Locked'}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 italic mb-4">
              {isGreek ? 'Χρειάζεστε 8loop' : 'You need 8loop'}
            </h1>
            <p className="text-sm leading-relaxed mb-6">
              {isGreek
                ? `Το 8loop ξεκλειδώνει άμεσα την πρόσβαση διαχείρισης, αλλά μόνο το ${exploreSupabaseAdminEmail} μπορεί να επεξεργαστεί άρθρα.`
                : `8loop unlocks admin access directly, but only ${exploreSupabaseAdminEmail} can edit articles.`}
            </p>
            <Link
              to="/explore"
              className="inline-flex bg-stone-900 text-stone-50 py-3 px-6 text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              {isGreek ? 'Επιστροφή στο Explore' : 'Back to Explore'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-stone-50 flex flex-col p-4 sm:p-6 lg:p-16">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-stone-200">
          <div>
             <div className="text-[10px] uppercase tracking-[0.2em] text-[#8B7E66] mb-2 font-medium">
               {isGreek ? 'Εσωτερικό Σύστημα' : 'Internal System'}
             </div>
             <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 italic">
               {isGreek ? 'Διαχείριση Περιεχομένου' : 'Editor Admin Dashboard'}
             </h1>
             <p className="mt-3 text-sm text-stone-600">
               {isGreek
                 ? `Συνδεθείτε με το ${exploreSupabaseAdminEmail} και ενεργοποιήστε το 8loop για να επεξεργαστείτε άρθρα.`
                 : `Sign in with ${exploreSupabaseAdminEmail} and activate 8loop to edit articles.`}
             </p>
          </div>
          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
            <button
              onClick={handleTriggerGeneration}
              disabled={isGenerating}
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-[#EAE7E0] text-stone-900 border border-[#E5E1D8] py-3 px-6 text-[10px] uppercase tracking-widest hover:bg-[#E5E1D8] transition-colors font-bold"
            >
              <Bot className="w-4 h-4" />
              {isGenerating ? (isGreek ? 'ΔΗΜΙΟΥΡΓΙΑ...' : 'GENERATING...') : (isGreek ? 'Δημιουργία Ουράς AI' : 'Generate AI Queue')}
            </button>
            <Link 
            to="/explore/admin/new" 
              className="inline-flex w-full sm:w-auto justify-center bg-stone-900 text-stone-50 py-3 px-6 text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              {isGreek ? '+ Νέο Άρθρο' : '+ New Article'}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 border-b border-stone-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 text-[10px] uppercase tracking-widest font-medium transition-colors ${activeTab === 'all' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-[#8B7E66] hover:text-stone-700'}`}
            >
              {isGreek ? `Όλα τα Άρθρα (${articles.length})` : `All Articles (${articles.length})`}
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`pb-2 text-[10px] uppercase tracking-widest font-medium transition-colors ${activeTab === 'drafts' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-[#8B7E66] hover:text-stone-700'}`}
            >
              {isGreek ? `Προσχέδια (${articles.filter(a => a.status === 'draft').length})` : `Drafts (${articles.filter(a => a.status === 'draft').length})`}
            </button>
          </div>
          
          {displayedArticles.length === 0 && (
            <div className="text-center py-12 text-stone-500 text-sm font-medium">
              {isGreek ? 'Κανένα άρθρο δεν βρέθηκε.' : 'No articles found.'}
            </div>
          )}
          
          {displayedArticles.map((article) => {
             const isDraft = article.status === 'draft';
             return (
               <div key={article.id} className={`bg-white border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${isDraft ? 'border-dashed border-stone-300 opacity-75' : 'border-[#E5E1D8]'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] uppercase tracking-widest bg-stone-100 px-2 py-1">{article.language.toUpperCase()}</span>
                      <span className="text-[9px] uppercase tracking-widest bg-stone-100 px-2 py-1">{article.category}</span>
                      {isDraft && (
                        <span className="text-[9px] uppercase tracking-widest bg-amber-100 text-amber-800 px-2 py-1">
                          {article.authorId === 'gemini'
                            ? (isGreek ? 'ΟΥΡΑ' : 'QUEUED')
                            : (isGreek ? 'ΠΡΟΣΧΕΔΙΟ' : 'DRAFT')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-stone-900 line-clamp-1">{article.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => void toggleStatus(article.id, article.status)}
                      className="p-2 text-stone-500 hover:text-stone-900 transition-colors border border-transparent hover:border-stone-200 bg-stone-50"
                      title={isDraft ? (isGreek ? 'Δημοσίευση' : 'Publish') : (isGreek ? 'Απόκρυψη σε Προσχέδιο' : 'Move to Drafts')}
                    >
                      {isDraft ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    {!isDraft ? (
                      <Link 
                        to={`/explore/${article.slug}`} 
                        className="p-2 text-stone-500 hover:text-orange-600 transition-colors border border-transparent hover:border-orange-200 bg-stone-50"
                        title={isGreek ? 'Προβολή Live' : 'View Live'}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    ) : (
                      <div className="w-[34px]" /> // Placeholder for alignment
                    )}
                    <button 
                      onClick={() => void handleDelete(article.id)}
                      className="p-2 text-stone-500 hover:text-red-600 transition-colors border border-transparent hover:border-red-200 bg-stone-50"
                      title={isGreek ? 'Διαγραφή' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}
