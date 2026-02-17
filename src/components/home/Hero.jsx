import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FloatingEmojis from './FloatingEmojis';
import { Search, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../utils/constants';

export default function Hero() {
    const { dispatch } = useApp();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [changingEmoji, setChangingEmoji] = useState('🔥');

    // Rotating emoji animation
    useEffect(() => {
        const emojis = ['🔥', '💫', '⭐', '🎉', '🌟', '🚀', '💎', '✨'];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % emojis.length;
            setChangingEmoji(emojis[idx]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            dispatch({ type: 'SET_SEARCH', payload: searchValue });
            navigate('/browse');
        }
    };

    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 pt-[72px]">
            {/* Background */}
            <div className="absolute inset-0 bg-hero-mesh animate-pulse-glow opacity-30 pointer-events-none" />
            <div className="absolute inset-0 rad-gradient pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />
            <FloatingEmojis />

            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-8 animate-fade-in">


                {/* Headline */}
                <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1]">
                    <span className="block text-white">Find the Perfect</span>
                    <span className="flex items-center justify-center gap-4">
                        <span className="gradient-text">Emoji</span>
                        <span className="inline-block animate-emoji-pop min-w-[1.2em]">{changingEmoji}</span>
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl font-body leading-relaxed">
                    Browse, search, copy, and download any emoji instantly. <br className="hidden md:block" />
                    The most beautiful emoji platform on the internet.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <Link to="/browse" className="btn-primary w-full sm:w-auto text-lg px-8">
                        Browse All Emojis →
                    </Link>
                    <Link to="/tools/ai-finder" className="btn-ghost w-full sm:w-auto text-lg px-8 flex items-center justify-center gap-2">
                        Try AI Finder <Sparkles size={18} />
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl mt-8 relative group">
                    <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-brand-500 to-neon-purple rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <div className="flex items-center bg-dark-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                        {/* Category Dropdown (Fake/Link) */}
                        <div className="hidden sm:flex items-center gap-2 px-3 border-r border-white/10 text-white/60 cursor-pointer hover:text-white transition-colors">
                            <span>All</span>
                            <ChevronDown size={14} />
                        </div>

                        <input
                            type="text"
                            placeholder="Search for emojis, categories, or keywords... (⌘K)"
                            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg text-white placeholder-white/30"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />

                        <button type="submit" className="p-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors">
                            <Search size={20} />
                        </button>
                    </div>
                </form>

                {/* Stats Pills */}
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <div className="glass px-4 py-2 text-sm flex items-center gap-2 text-white/70">
                        <span>🎯</span> 3,655 emojis
                    </div>
                    <div className="glass px-4 py-2 text-sm flex items-center gap-2 text-white/70">
                        <span>📂</span> 50+ categories
                    </div>
                    <div className="glass px-4 py-2 text-sm flex items-center gap-2 text-white/70">
                        <span>⚡</span> 1-click copy
                    </div>
                </div>
            </div>
        </div>
    );
}
