/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useParams } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ArticleProvider } from './contexts/ArticleContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ExplorePage } from './pages/ExplorePage';
import { ArticlePage } from './pages/ArticlePage';
import { SignUpPage } from './pages/SignUpPage';
import { AdminPage } from './pages/AdminPage';
import { NewArticlePage } from './pages/NewArticlePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ArticleProvider>
          <Router>
            <div className="flex min-h-screen flex-col font-sans text-stone-900 bg-stone-50 selection:bg-orange-200">
              <Header />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Navigate to="/explore" replace />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/explore/:slug" element={<ArticlePage />} />
                  <Route path="/signup" element={<Navigate to="/explore/signup" replace />} />
                  <Route path="/explore/signup" element={<SignUpPage />} />
                  <Route path="/admin" element={<Navigate to="/explore/admin" replace />} />
                  <Route path="/explore/admin" element={<AdminPage />} />
                  <Route path="/admin/new" element={<Navigate to="/explore/admin/new" replace />} />
                  <Route path="/explore/admin/new" element={<NewArticlePage />} />
                  <Route path="/privacy" element={<Navigate to="/explore/privacy" replace />} />
                  <Route path="/explore/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<Navigate to="/explore/terms" replace />} />
                  <Route path="/explore/terms" element={<TermsPage />} />
                  <Route path="/:slug" element={<LegacyArticleRedirect />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </ArticleProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

function LegacyArticleRedirect() {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/explore" replace />;
  }

  return <Navigate to={`/explore/${slug}`} replace />;
}
