import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import EmojiCard from '../emoji/EmojiCard';
import SkeletonCard from '../ui/SkeletonCard';
import { pickDaily } from '../../utils/dailyRotation';

export default function FeaturedSection() {
    const { state } = useApp();

    const display = useMemo(() => {
        if (!state.emojis || state.emojis.length === 0) return [];
        // "New in v15.1" is a curated rotating set that changes daily
        return pickDaily(state.emojis, 8, { key: 'new-v15-1', getId: (x) => x?.emoji || x?.id });
    }, [state.emojis]);

    return (
        <section className="py-20 container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8 animate-fade-in">
                <span className="text-2xl">🎉</span>
                <h2 className="section-title text-white">New in version 15.1</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {state.isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    : display.map(emoji => (
                        <EmojiCard key={emoji.id} emoji={{ ...emoji, isNew: true }} size="lg" />
                    ))
                }
            </div>
        </section>
    );
}
