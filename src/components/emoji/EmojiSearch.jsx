import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useClipboard } from '../../hooks/useClipboard';

export default function EmojiSearch({ autoFocus = false }) {
    const { state, dispatch } = useApp();
    const { copy } = useClipboard();
    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const clearSearch = () => {
        dispatch({ type: 'SET_SEARCH', payload: '' });
        inputRef.current?.focus();
    };

    const query = (state.searchQuery || '').trim().toLowerCase();
    const matches = useMemo(() => {
        if (!query) return [];

        const scored = [];
        for (const e of state.emojis) {
            const name = (e?.name || '').toLowerCase();
            const displayName = (e?.displayName || '').toLowerCase();
            const group = (e?.group || '').toLowerCase();
            const originalCategory = (e?.originalCategory || '').toLowerCase();
            const keywords = Array.isArray(e?.keywords) ? e.keywords.map(k => (k || '').toLowerCase()) : [];

            const haystackMatch =
                name.includes(query) ||
                displayName.includes(query) ||
                group.includes(query) ||
                originalCategory.includes(query) ||
                keywords.some(k => k.includes(query));

            if (!haystackMatch) continue;

            // Simple ranking: exact > startsWith > includes
            const exact = name === query || displayName === query ? 3 : 0;
            const starts = name.startsWith(query) || displayName.startsWith(query) ? 2 : 0;
            const inName = name.includes(query) || displayName.includes(query) ? 1 : 0;
            const score = exact + starts + inName;
            scored.push({ e, score });
        }

        scored.sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name));
        return scored.map(x => x.e);
    }, [state.emojis, query]);

    return (
        <div className="relative w-full max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/40 group-focus-within:text-brand-400 transition-colors" />
            </div>

            <input
                ref={inputRef}
                type="text"
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 120)}
                placeholder="Search 3,600+ emojis..."
                className="w-full bg-dark-800/50 backdrop-blur-sm border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-lg text-white placeholder-white/30 
                   focus:outline-none focus:border-brand-500/50 focus:bg-dark-800 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-lg"
                autoFocus={autoFocus}
            />

            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                {state.searchQuery ? (
                    <button
                        onClick={clearSearch}
                        className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                ) : (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-xs font-mono text-white/30 hidden sm:flex">
                        <Command size={10} />
                        <span>K</span>
                    </div>
                )}
            </div>

            {/* Suggestions / results preview */}
            {isOpen && query && (
                <div className="absolute left-0 right-0 mt-3 z-50">
                    <div className="bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between gap-3">
                            <div className="text-sm text-white/70">
                                Results containing <span className="text-white font-semibold">"{state.searchQuery}"</span>
                            </div>
                            <div className="text-xs text-white/40">
                                {matches.length} matches
                            </div>
                        </div>

                        {matches.length === 0 ? (
                            <div className="px-4 py-4 text-sm text-white/50">No matches found.</div>
                        ) : (
                            <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                                {matches.map((e) => (
                                    <button
                                        key={`suggest-${e.id}`}
                                        type="button"
                                        onMouseDown={(ev) => ev.preventDefault()}
                                        onClick={() => copy(e.emoji, e)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-left transition-colors"
                                    >
                                        <span className="text-2xl w-8 text-center shrink-0">{e.emoji}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm text-white/90 truncate">{e.displayName || e.name}</div>
                                            <div className="text-xs text-white/40 truncate">{e.group}</div>
                                        </div>
                                        <div className="text-[10px] text-white/40 shrink-0">Click to copy</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
