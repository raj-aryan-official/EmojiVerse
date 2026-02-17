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
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? 'h-16 bg-dark-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
                    : 'h-20 bg-transparent border-b border-transparent'
                }`}
        >
            {/* Scrolled bottom highlight */}
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

            <div className="container mx-auto px-4 h-full flex items-center justify-between gap-6">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-brand-600 to-indigo-600 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-300 overflow-hidden ring-1 ring-white/10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-50" />

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14.5L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="white" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none group-hover:text-brand-300 transition-colors">
                            EmojiVerse
                        </h1>
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium group-hover:text-white/60 transition-colors">Premium Collection</span>
                    </div>
                </Link>

                {/* Search Bar (Desktop) - Enhanced */}
                <div className={`hidden md:block flex-1 max-w-lg transition-all duration-300 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-1'}`}>
                    <button
                        onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE', payload: true })}
                        className="w-full relative group overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full px-5 py-2.5 text-sm text-white/50 transition-all flex justify-between items-center backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 transition-colors group-hover:text-white/80">
                            <span className="opacity-50"><Menu size={16} className="rotate-90" /></span> {/* Using Menu as a search icon placeholder if needed, or just text */}
                            <span>Find anything...</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 bg-black/20 px-2 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">
                            <span className="text-xs">⌘</span> K
                        </span>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-500/10 via-transparent to-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                </div>

                {/* Desktop Nav Actions */}
                <div className="hidden lg:flex items-center gap-2">
                    <nav className="flex items-center p-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                        <Link
                            to="/browse"
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === '/browse'
                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Browse
                        </Link>

                        <div className="relative group px-1">
                            <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${isToolsActive
                                    ? 'text-white bg-white/10'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}>
                                Tools <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 opacity-60" />
                            </button>

                            {/* Dropdown Menu - Enhanced */}
                            <div className="absolute top-full right-0 mt-4 w-60 p-2 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="text-[10px] uppercase tracking-wider text-white/30 px-3 py-2 font-semibold">AI Power Tools</div>
                                <Link to="/tools/ai-finder" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all group/item">
                                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 group-hover/item:bg-brand-500/20 group-hover/item:scale-110 transition-all">
                                        <Sparkles size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">AI Finder</span>
                                        <span className="text-[10px] text-white/30">Semantic search</span>
                                    </div>
                                </Link>
                                <div className="h-[1px] bg-white/5 my-1 mx-2" />
                                <Link to="/tools/combiner" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all">
                                    <span className="text-lg grayscale group-hover:grayscale-0 transition-all delay-75">🧩</span>
                                    <span className="text-sm font-medium">Combiner</span>
                                </Link>
                                <Link to="/tools/text-generator" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all">
                                    <span className="text-lg grayscale group-hover:grayscale-0 transition-all delay-75">✍️</span>
                                    <span className="text-sm font-medium">Text Gen</span>
                                </Link>
                                <Link to="/tools/quiz" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all">
                                    <span className="text-lg grayscale group-hover:grayscale-0 transition-all delay-75">🎮</span>
                                    <span className="text-sm font-medium">Quiz Mode</span>
                                </Link>
                                <Link to="/tools/moodboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all">
                                    <span className="text-lg grayscale group-hover:grayscale-0 transition-all delay-75">🎨</span>
                                    <span className="text-sm font-medium">Mood Board</span>
                                </Link>
                            </div>
                        </div>
                    </nav>

                    <Link
                        to="/favorites"
                        className={`relative group p-2.5 rounded-full transition-all duration-300 ${location.pathname === '/favorites'
                                ? 'bg-pink-500/10 text-pink-500 ring-1 ring-pink-500/50'
                                : 'bg-white/5 text-white/60 hover:text-pink-400 hover:bg-pink-500/10'
                            }`}
                    >
                        <Heart size={20} className={`transition-transform duration-300 group-hover:scale-110 ${location.pathname === '/favorites' ? 'fill-current' : ''}`} />
                        {state.favorites.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#050505]">
                                {state.favorites.length}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Right Actions (Mobile) */}
                <div className="lg:hidden flex items-center gap-2">
                    <Link
                        to="/favorites"
                        className={`p-2 rounded-full transition-colors ${location.pathname === '/favorites' ? 'text-pink-500' : 'text-white/60'
                            }`}
                    >
                        <Heart size={20} className={location.pathname === '/favorites' ? 'fill-current' : ''} />
                    </Link>
                    <button
                        className="p-2 text-white/70 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5"
                        onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
                    >
                        {state.isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
