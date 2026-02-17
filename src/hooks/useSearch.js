import { useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { filterEmojis, sortEmojis } from '../utils/emojiHelpers';
import { useDebounce } from './useDebounce';

export function useSearch() {
    const { state, dispatch } = useApp();
    const debouncedSearch = useDebounce(state.searchQuery, 300);

    // Derived filtered state
    const filteredEmojis = useMemo(() => {
        if (state.emojis.length === 0) return [];

        const filtered = filterEmojis(state.emojis, {
            searchQuery: debouncedSearch,
            category: state.activeCategory,
            mood: state.activeMood,
            group: state.activeGroup,
        });

        return sortEmojis(filtered, state.sortBy);
    }, [state.emojis, debouncedSearch, state.activeCategory, state.activeMood, state.activeGroup, state.sortBy]);

    // Handle URL syncing (optional, usually done in page component or here)
    // For now we just return the filtered list

    return { filteredEmojis, count: filteredEmojis.length };
}
