import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSearch } from '../../hooks/useSearch';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import EmojiCard from './EmojiCard';
import SkeletonCard from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';
import { ITEMS_PER_PAGE } from '../../utils/constants';

export default function EmojiGrid() {
    const { state, dispatch } = useApp();
    // useSearch processes filters and sorting. We slice it here for pagination.
    const { filteredEmojis } = useSearch();
    const [bottomRef, isIntersecting] = useIntersectionObserver();

    // Pagination logic
    const displayedEmojis = filteredEmojis.slice(0, state.page * ITEMS_PER_PAGE);
    const hasMore = displayedEmojis.length < filteredEmojis.length;

    React.useEffect(() => {
        if (isIntersecting && hasMore && !state.isLoading) {
            dispatch({ type: 'LOAD_MORE' });
        }
    }, [isIntersecting, hasMore, state.isLoading, dispatch]);

    if (state.isLoading) {
        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4">
                {Array.from({ length: 24 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (filteredEmojis.length === 0) {
        return (
            <EmptyState
                title="No emojis found"
                description="Try adjusting your search or filters."
                action={
                    <button
                        onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                        className="mt-4 btn-primary"
                    >
                        Clear Filters
                    </button>
                }
            />
        );
    }

    // Determine grid columns based on emojiSize preference
    const gridCols = {
        sm: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10',
        md: 'grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8', // default
        lg: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
    };
    const currentGridClass = gridCols[state.emojiSize] || gridCols.md;

    return (
        <div className="w-full">
            <div className={`grid ${currentGridClass} gap-3 sm:gap-4 p-4`}>
                {displayedEmojis.map(emoji => (
                    <EmojiCard key={emoji.id} emoji={emoji} size={state.emojiSize} />
                ))}
            </div>

            {/* Search results count (optional sticky footer or just text) */}
            <div className="text-center py-8 text-white/30 text-sm">
                Showing {displayedEmojis.length} of {filteredEmojis.length} emojis
                {hasMore && (
                    <div ref={bottomRef} className="h-20 flex items-center justify-center mt-4">
                        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
