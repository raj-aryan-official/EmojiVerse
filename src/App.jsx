import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import EmojiDetail from './pages/EmojiDetail';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import AIFinder from './pages/AIFinder';
import EmojiCombiner from './pages/EmojiCombiner';
import TextGenerator from './pages/TextGenerator';
import EmojiQuiz from './pages/EmojiQuiz';
import MoodBoard from './pages/MoodBoard';
import { useApp } from './context/AppContext';
import { useEmojis } from './hooks/useEmojis';

export default function App() {
  const { path } = useLocation();
  const { state } = useApp();

  // Initialize Emoji Data
  useEmojis();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  // Loading Screen (Initial)
  if (state.isLoading && state.emojis.length === 0) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center z-50">
        <div className="text-6xl animate-bounce mb-4">✨</div>
        <div className="text-brand-400 font-bold animate-pulse">Loading EmojiVerse...</div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/emoji/:slug" element={<EmojiDetail />} />
        <Route path="/favorites" element={<Favorites />} />

        {/* Tools */}
        <Route path="/tools/ai-finder" element={<AIFinder />} />
        <Route path="/tools/combiner" element={<EmojiCombiner />} />
        <Route path="/tools/text-generator" element={<TextGenerator />} />
        <Route path="/tools/quiz" element={<EmojiQuiz />} />
        <Route path="/tools/moodboard" element={<MoodBoard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
