import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MAX_RECENT_HISTORY, MAX_RECENT_COPIES, ITEMS_PER_PAGE } from '../utils/constants';

// Initial State
const initialState = {
    // Data
    emojis: [],
    isLoading: true,
    error: null,

    // Filtering
    filteredEmojis: [],
    searchQuery: '',
    activeCategory: 'all',
    activeMood: null,
    activeGroup: null,
    sortBy: 'default',          // 'default' | 'name' | 'popular' | 'newest'
    viewMode: 'grid',           // 'grid' | 'list' | 'compact'

    // User Prefs (loaded from localStorage elsewhere or initialized here if using sync localStorage)
    // We'll trust the initializer to load these if needed, or effects to sync them
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed') || '[]'),
    recentlyCopied: JSON.parse(localStorage.getItem('recentlyCopied') || '[]'),
    theme: localStorage.getItem('theme') || 'dark',
    emojiSize: localStorage.getItem('emojiSize') || 'md',
    preferredSkinTone: Number(localStorage.getItem('preferredSkinTone') || 0),

    // UI State
    toasts: [],
    isCommandPaletteOpen: false,
    isKeyboardShortcutsOpen: false,
    isMobileMenuOpen: false,

    // Pagination
    page: 1,
    hasMore: true,
};

// Reducer
function appReducer(state, action) {
    switch (action.type) {
        case 'SET_EMOJIS':
            return { ...state, emojis: action.payload, isLoading: false };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };

        // Filters & Sort
        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload, page: 1 }; // Reset page on filter change
        case 'SET_CATEGORY':
            return { ...state, activeCategory: action.payload, activeGroup: null, page: 1 };
        case 'SET_MOOD':
            return { ...state, activeMood: action.payload, page: 1 };
        case 'SET_GROUP':
            return { ...state, activeGroup: action.payload, page: 1 };
        case 'SET_SORT':
            return { ...state, sortBy: action.payload, page: 1 };
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'LOAD_MORE':
            return { ...state, page: state.page + 1 };
        case 'RESET_FILTERS':
            return {
                ...state,
                searchQuery: '',
                activeCategory: 'all',
                activeMood: null,
                activeGroup: null,
                sortBy: 'default',
                page: 1
            };

        // User Prefs
        case 'TOGGLE_FAVORITE': {
            const { id } = action.payload; // emoji object or id
            const isFav = state.favorites.some(f => f.id === id);
            const newFavorites = isFav
                ? state.favorites.filter(f => f.id !== id)
                : [action.payload, ...state.favorites];

            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return { ...state, favorites: newFavorites };
        }
        case 'ADD_RECENTLY_VIEWED': {
            const filtered = state.recentlyViewed.filter(i => i.id !== action.payload.id);
            const newRecent = [action.payload, ...filtered].slice(0, MAX_RECENT_HISTORY);
            localStorage.setItem('recentlyViewed', JSON.stringify(newRecent));
            return { ...state, recentlyViewed: newRecent };
        }
        case 'ADD_RECENTLY_COPIED': {
            const filtered = state.recentlyCopied.filter(i => i.id !== action.payload.id);
            const newCopied = [action.payload, ...filtered].slice(0, MAX_RECENT_COPIES);
            localStorage.setItem('recentlyCopied', JSON.stringify(newCopied));
            return { ...state, recentlyCopied: newCopied };
        }
        case 'SET_THEME':
            localStorage.setItem('theme', action.payload);
            return { ...state, theme: action.payload };
        case 'SET_EMOJI_SIZE':
            localStorage.setItem('emojiSize', action.payload);
            return { ...state, emojiSize: action.payload };
        case 'SET_SKIN_TONE':
            localStorage.setItem('preferredSkinTone', action.payload);
            return { ...state, preferredSkinTone: action.payload };

        // UI State
        case 'ADD_TOAST':
            return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
        case 'REMOVE_TOAST':
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
        case 'TOGGLE_COMMAND_PALETTE':
            return { ...state, isCommandPaletteOpen: action.payload !== undefined ? action.payload : !state.isCommandPaletteOpen };
        case 'TOGGLE_KEYBOARD_SHORTCUTS':
            return { ...state, isKeyboardShortcutsOpen: action.payload !== undefined ? action.payload : !state.isKeyboardShortcutsOpen };
        case 'TOGGLE_MOBILE_MENU':
            return { ...state, isMobileMenuOpen: action.payload !== undefined ? action.payload : !state.isMobileMenuOpen };

        default:
            return state;
    }
}

// Context
const AppContext = createContext();

// Provider
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Sync theme with HTML class
    useEffect(() => {
        const root = window.document.documentElement;
        if (state.theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else if (state.theme === 'light') {
            root.classList.add('light');
            root.classList.remove('dark');
        } else {
            // System
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
                root.classList.remove('light');
            } else {
                root.classList.add('light');
                root.classList.remove('dark');
            }
        }
    }, [state.theme]);

    // Derived state: Filtered Emojis
    // We compute this here to keep render pure, but for performance with thousands item 
    // we might want to memoize this processing or do it in the reducer if it causes lag.
    // For now, let's do it in the component where it's used or use a memoized hook. 
    // Actually, let's just expose state and dispatch, and handling filtering in hooks.

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

// Custom Hook
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
