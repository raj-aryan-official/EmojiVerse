import React, { useEffect, useState, useRef } from 'react';
import { Search, Command, Heart, Zap, Grid, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { normalizeEmoji } from '../../utils/emojiHelpers';

export default function CommandPalette() {
    const { state, dispatch } = useApp();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const isOpen = state.isCommandPaletteOpen;

    const onClose = () => dispatch({ type: 'TOGGLE_COMMAND_PALETTE', payload: false });

    // Filter items
    const pages = [
        { id: 'home', name: 'Home', icon: <Grid size={16} />, action: () => navigate('/') },
        { id: 'browse', name: 'Browse Emojis', icon: <Search size={16} />, action: () => navigate('/browse') },
        { id: 'favorites', name: 'Favorites', icon: <Heart size={16} />, action: () => navigate('/favorites') },
        { id: 'combiner', name: 'Emoji Combiner', icon: <Zap size={16} />, action: () => navigate('/tools/combiner') },
        { id: 'finder', name: 'AI Finder', icon: <Sparkles size={16} />, action: () => navigate('/tools/ai-finder') },
    ];

    const filteredPages = query
        ? pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        : pages;

    const filteredEmojis = query && state.emojis.length > 0
        ? state.emojis.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
        : [];

    const allItems = [...filteredPages, ...filteredEmojis];

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
            }
            if (isOpen) {
                if (e.key === 'Escape') onClose();
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex(prev => (prev + 1) % allItems.length);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex(prev => (prev - 1 + allItems.length) % allItems.length);
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const item = allItems[activeIndex];
                    if (item) {
                        if (item.action) {
                            item.action();
                        } else if (item.emoji) {
                            // It's an emoji
                            navigate(`/emoji/${item.id}`);
                        }
                        onClose();
                    }
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, allItems, activeIndex, dispatch, navigate]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
            <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[60vh]">
                <div className="flex items-center px-4 py-4 border-b border-white/5">
                    <Search className="text-white/40 mr-3" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/20 text-lg"
                    />
                    <div className="text-xs text-white/20 font-mono border border-white/10 px-2 py-1 rounded">ESC</div>
                </div>

                <div className="overflow-y-auto p-2">
                    {allItems.length === 0 ? (
                        <div className="p-8 text-center text-white/30">No results found</div>
                    ) : (
                        <>
                            <div className="text-xs font-bold text-white/30 px-2 py-2 mb-1 uppercase tracking-wider">Navigation & Tools</div>
                            {allItems.map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.action) item.action();
                                        else navigate(`/emoji/${item.id}`);
                                        onClose();
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors
                     ${index === activeIndex ? 'bg-brand-600 text-white' : 'text-white/70 hover:bg-white/5'}
                   `}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    {item.emoji ? <span className="text-xl">{item.emoji}</span> : item.icon}
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        {item.emoji && <div className="text-xs opacity-50">Emoji</div>}
                                    </div>
                                    {index === activeIndex && <span className="text-xs opacity-50 mx-2">↵</span>}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
