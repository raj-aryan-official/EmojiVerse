import React, { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EmojiGrid from '../components/emoji/EmojiGrid';
import CategoryFilter from '../components/emoji/CategoryFilter';
import EmojiSearch from '../components/emoji/EmojiSearch';
import { CATEGORIES, MOODS, SORT_OPTIONS } from '../utils/constants';
import { Filter, SlidersHorizontal, Grid as GridIcon, List as ListIcon } from 'lucide-react';

export default function Browse() {
    const { state, dispatch } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();

    const groups = useMemo(() => {
        const set = new Set();
        for (const e of state.emojis) {
            if (!e?.group) continue;
            const g = String(e.group).trim().toLowerCase();
            if (!g || g === 'others') continue;
            set.add(g);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [state.emojis]);

    // Keep latest state in a ref so URL->state sync doesn't re-run on state changes
    const stateRef = useRef({
        activeCategory: state.activeCategory,
        activeGroup: state.activeGroup,
        sortBy: state.sortBy,
        searchQuery: state.searchQuery,
    });

    useEffect(() => {
        stateRef.current = {
            activeCategory: state.activeCategory,
            activeGroup: state.activeGroup,
            sortBy: state.sortBy,
            searchQuery: state.searchQuery,
        };
    }, [state.activeCategory, state.activeGroup, state.sortBy, state.searchQuery]);

    // Sync URL params to state on mount/update
    useEffect(() => {
        const categoryParam = searchParams.get('category') || 'all';
        const sortParam = searchParams.get('sort') || 'default';
        const qParam = searchParams.get('q') || '';
        const groupParamRaw = searchParams.get('group');
        const groupParam = groupParamRaw ? String(groupParamRaw).trim().toLowerCase() : null;

        // Validate category/sort against known options to avoid invalid state from URL
        const isValidCategory = CATEGORIES.some(c => c.id === categoryParam);
        const safeCategory = isValidCategory ? categoryParam : 'all';
        const isValidSort = SORT_OPTIONS.some(s => s.id === sortParam);
        const safeSort = isValidSort ? sortParam : 'default';
        const safeGroup = groupParam
            ? (groups.length === 0 || groups.includes(groupParam) ? groupParam : null)
            : null;

        const cur = stateRef.current;

        if (safeCategory !== cur.activeCategory) {
            dispatch({ type: 'SET_CATEGORY', payload: safeCategory });
        }
        if (safeGroup !== cur.activeGroup) {
            dispatch({ type: 'SET_GROUP', payload: safeGroup });
        }
        if (safeSort !== cur.sortBy) {
            dispatch({ type: 'SET_SORT', payload: safeSort });
        }
        if (qParam !== cur.searchQuery) {
            dispatch({ type: 'SET_SEARCH', payload: qParam });
        }
    }, [searchParams, dispatch, groups]);

    // Sync state back to URL
    useEffect(() => {
        const params = {};
        if (state.activeCategory !== 'all') params.category = state.activeCategory;
        if (state.activeGroup) params.group = state.activeGroup;
        if (state.sortBy !== 'default') params.sort = state.sortBy;
        if (state.searchQuery) params.q = state.searchQuery;
        setSearchParams(params, { replace: true });
    }, [state.activeCategory, state.activeGroup, state.sortBy, state.searchQuery, setSearchParams]);

    return (
        <div className="container mx-auto px-4 py-8 flex gap-8 min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-64 shrink-0 space-y-8 h-full overflow-y-auto custom-scrollbar pr-2">
                <div>
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Filter size={18} /> Categories
                    </h3>
                    <div className="space-y-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => dispatch({ type: 'SET_CATEGORY', payload: cat.id })}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
                   ${state.activeCategory === cat.id ? 'bg-brand-600/20 text-brand-400 font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}
                 `}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Derived Subcategories/Groups (50+ items) */}
                {groups.length > 0 && (
                    <div>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <SlidersHorizontal size={18} /> More Categories
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => dispatch({ type: 'SET_GROUP', payload: null })}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
                   ${!state.activeGroup ? 'bg-white/5 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}
                 `}
                            >
                                <span>📚</span>
                                All subcategories
                            </button>
                            {groups.slice(0, 60).map(g => (
                                <button
                                    key={g}
                                    onClick={() => dispatch({ type: 'SET_GROUP', payload: g })}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
                   ${state.activeGroup === g ? 'bg-brand-600/20 text-brand-400 font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}
                 `}
                                >
                                    <span>🏷️</span>
                                    <span className="truncate">{g}</span>
                                </button>
                            ))}
                        </div>
                        {groups.length > 60 && (
                            <div className="mt-2 text-xs text-white/40">
                                Showing 60 of {groups.length}. (We can add search here if you want.)
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <h3 className="font-bold text-white mb-4">Moods</h3>
                    <div className="flex flex-wrap gap-2">
                        {MOODS.map(mood => (
                            <button
                                key={mood.id}
                                onClick={() => dispatch({ type: 'SET_MOOD', payload: state.activeMood === mood.id ? null : mood.id })}
                                className={`px-3 py-1 rounded-full text-xs transition-colors border
                   ${state.activeMood === mood.id
                                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                        : 'bg-dark-800 border-white/5 text-white/50 hover:border-white/20 hover:text-white'}
                 `}
                            >
                                {mood.emoji} {mood.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recently Viewed */}
                {state.recentlyViewed.length > 0 && (
                    <div>
                        <h3 className="font-bold text-white mb-4">Recently Viewed</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {state.recentlyViewed.slice(0, 8).map(emoji => (
                                <div key={emoji.id} className="aspect-square bg-dark-800 rounded-lg flex items-center justify-center text-xl cursor-default" title={emoji.name}>
                                    {emoji.emoji}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 min-w-0 lg:h-full lg:min-h-0">
                {/* Stable header area on lg+; normal flow on mobile */}
                <div className="flex flex-col gap-6 lg:sticky lg:top-0 lg:z-10 lg:pt-2 lg:pb-4 lg:bg-dark-950/70 lg:backdrop-blur-xl">
                    {/* Mobile Filters Bar */}
                    <div className="lg:hidden">
                        <CategoryFilter />
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <EmojiSearch />

                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                            <select
                                value={state.sortBy}
                                onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })}
                                className="bg-dark-800 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-500 appearance-none min-w-[140px]"
                            >
                                {SORT_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </select>

                            {/* View Toggle */}
                            <div className="flex bg-dark-800 rounded-xl border border-white/10 p-1">
                                <button
                                    onClick={() => dispatch({ type: 'SET_EMOJI_SIZE', payload: 'md' })}
                                    className={`p-2 rounded-lg transition-colors ${state.emojiSize === 'md' ? 'bg-brand-600 text-white' : 'text-white/50 hover:text-white'}`}
                                >
                                    <GridIcon size={20} />
                                </button>
                                <button
                                    onClick={() => dispatch({ type: 'SET_EMOJI_SIZE', payload: 'sm' })}
                                    className={`p-2 rounded-lg transition-colors ${state.emojiSize === 'sm' ? 'bg-brand-600 text-white' : 'text-white/50 hover:text-white'}`}
                                >
                                    <ListIcon size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(state.activeCategory !== 'all' || state.activeMood || state.activeGroup || state.searchQuery) && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-white/40">Filters:</span>
                            {state.activeCategory !== 'all' && (
                                <button
                                    onClick={() => dispatch({ type: 'SET_CATEGORY', payload: 'all' })}
                                    className="pill pill-active flex items-center gap-1"
                                >
                                    Category: {CATEGORIES.find(c => c.id === state.activeCategory)?.name} <span className="opacity-50">×</span>
                                </button>
                            )}
                            {state.activeMood && (
                                <button
                                    onClick={() => dispatch({ type: 'SET_MOOD', payload: null })}
                                    className="pill pill-active flex items-center gap-1 bg-purple-600 border-purple-500"
                                >
                                    Mood: {MOODS.find(m => m.id === state.activeMood)?.name} <span className="opacity-50">×</span>
                                </button>
                            )}
                            {state.activeGroup && (
                                <button
                                    onClick={() => dispatch({ type: 'SET_GROUP', payload: null })}
                                    className="pill pill-active flex items-center gap-1 bg-white/10 border-white/20"
                                >
                                    Sub: {state.activeGroup} <span className="opacity-50">×</span>
                                </button>
                            )}
                            {state.searchQuery && (
                                <button
                                    onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
                                    className="pill pill-active flex items-center gap-1 bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                                >
                                    Search: "{state.searchQuery}" <span className="opacity-50">×</span>
                                </button>
                            )}
                            <button onClick={() => dispatch({ type: 'RESET_FILTERS' })} className="text-xs text-white/40 hover:text-white underline ml-2">Clear All</button>
                        </div>
                    )}
                </div>

                {/* Scroll area on lg+ so only emojis move */}
                <div className="w-full lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar lg:pr-2">
                    <EmojiGrid />
                </div>
            </div>
        </div>
    );
}
