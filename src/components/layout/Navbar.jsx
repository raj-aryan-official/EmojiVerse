import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Heart, Sparkles, X, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmojiSearch from '../emoji/EmojiSearch';

export default function Navbar() {
    const { state, dispatch } = useApp();
    const location = useLocation();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isToolsActive = location.pathname.startsWith('/tools');

    return (
        <nav className={`sticky top-0 z-40 w-full transition-all duration-500 ${scrolled
                ? 'h-16 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-brand-500/5'
                : 'h-20 bg-transparent border-b border-transparent'
            }`}>
            {/* Animated Bottom Border Gradient (Visible on scroll) */}
            <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

            <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group relative z-10">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 rounded-xl ring-1 ring-inset ring-white/10" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transform group-hover:rotate-12 transition-transform duration-500">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14.5L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-300 transition-all duration-300">
                            EmojiVerse
                        </h1>
                    </div>
                </Link>

                {/* Search Bar (Desktop - Compact) */}
                <div className={`hidden md:block flex-1 max-w-md mx-4 transition-all duration-500 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'}`}>
                    <button
                        onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE', payload: true })}
                        className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl px-4 py-2.5 text-sm text-white/50 transition-all group flex justify-between items-center backdrop-blur-sm"
                    >
                        <span className="group-hover:text-white/80 transition-colors">Search emojis...</span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold opacity-50 bg-white/5 px-1.5 py-0.5 rounded text-white/50 group-hover:bg-white/10 transition-colors">
                            <span className="text-xs">⌘</span> K
                        </span>
                    </button>
                </div>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1">
                    <Link
                        to="/browse"
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all group overflow-hidden ${location.pathname === '/browse' ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                        <span className={`absolute inset-0 bg-white/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl ${location.pathname === '/browse' ? 'scale-100 bg-white/10' : ''}`} />
                        <span className="relative z-10">Browse</span>
                    </Link>

                    <div className="relative group">
                        <button className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all group flex items-center gap-1 overflow-hidden ${isToolsActive ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                            <span className={`absolute inset-0 bg-white/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl ${isToolsActive ? 'scale-100 bg-white/10' : ''}`} />
                            <span className="relative z-10 flex items-center gap-1">Tools <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" /></span>
                        </button>

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-4 w-56 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 translate-y-2 group-hover:translate-y-0">
                            <Link to="/tools/ai-finder" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors group/item">
                                <span className="p-1.5 bg-brand-500/20 rounded-lg text-brand-400 group-hover/item:text-brand-300 transition-colors"><Sparkles size={14} /></span>
                                AI Finder
                            </Link>
                            <Link to="/tools/combiner" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors">
                                <span className="text-lg">🧩</span> Combiner
                            </Link>
                            <Link to="/tools/text-generator" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors">
                                <span className="text-lg">✍️</span> Text Gen
                            </Link>
                            <Link to="/tools/quiz" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors">
                                <span className="text-lg">🎮</span> Quiz
                            </Link>
                            <Link to="/tools/moodboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors">
                                <span className="text-lg">🎨</span> Mood Board
                            </Link>
                        </div>
                    </div>

                    <Link
                        to="/favorites"
                        className={`ml-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 relative overflow-hidden group ${location.pathname === '/favorites' ? 'text-pink-400' : 'text-white/60 hover:text-pink-400'}`}
                    >
                        <span className={`absolute inset-0 bg-pink-500/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl ${location.pathname === '/favorites' ? 'scale-100' : ''}`} />
                        <Heart size={16} className={`relative z-10 transition-transform group-hover:scale-110 ${location.pathname === '/favorites' ? 'fill-current' : ''}`} />
                        <span className="relative z-10 bg-white/10 text-xs px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-white/5 group-hover:border-pink-500/30 transition-colors">{state.favorites.length}</span>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <button
                        className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
                        onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
                    >
                        {state.isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
