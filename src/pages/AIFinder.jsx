import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { matchEmojisToMood, KEYWORD_DICTIONARY } from '../utils/aiMatcher';
import EmojiCard from '../components/emoji/EmojiCard';
import { Sparkles } from 'lucide-react';
import ConfettiEffect from '../components/ui/ConfettiEffect';

export default function AIFinder() {
    const { state } = useApp();
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (!input.trim()) return;
        setIsSearching(true);

        // Simulate AI processing time
        setTimeout(() => {
            const matches = matchEmojisToMood(input, state.emojis);
            setResults(matches);
            setIsSearching(false);
        }, 800);
    };

    const moods = Object.keys(KEYWORD_DICTIONARY);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen max-w-4xl">
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex p-3 rounded-full bg-brand-500/20 text-brand-400 mb-4 animate-pulse-glow">
                    <Sparkles size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-display text-white">AI Emoji Finder 🤖</h1>
                <p className="text-xl text-white/60">Describe your vibe, feeling, or situation — get the perfect emojis.</p>
            </div>

            <div className="glass p-6 md:p-8 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-purple-500/5 pointer-events-none" />

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="I'm feeling excited about my vacation to the beach..."
                    className="w-full bg-dark-900/50 border border-white/10 rounded-xl p-4 text-lg text-white placeholder-white/20 focus:outline-none focus:border-brand-500/50 min-h-[120px] resize-none mb-4"
                />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                        {moods.slice(0, 6).map(mood => (
                            <button
                                key={mood}
                                onClick={() => setInput(prev => (prev + ' ' + mood).trim())}
                                className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                #{mood}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={isSearching || !input}
                        className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 min-w-[160px]"
                    >
                        {isSearching ? 'Analyzing...' : 'Find Emojis ✨'}
                    </button>
                </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="animate-slide-up">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-brand-400">⚡</span> Top Matches
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {results.map((emoji, idx) => (
                            <div key={emoji.id} className="relative group">
                                <EmojiCard emoji={emoji} size="lg" />
                                <div className="mt-2">
                                    <div className="h-1 bg-dark-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-500 to-purple-500"
                                            style={{ width: `${Math.min(100, emoji.matchScore * 5)}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-1 truncate">{emoji.matchReason}</p>
                                </div>
                                {/* Badge */}
                                <div className="absolute top-2 left-2 bg-brand-600 text-[10px] font-bold px-1.5 rounded shadow text-white">
                                    {Math.round(Math.min(99, emoji.matchScore * 5))}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
