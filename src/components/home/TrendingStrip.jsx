import React, { useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import EmojiCard from '../emoji/EmojiCard';
import SkeletonCard from '../ui/SkeletonCard';
import { pickDaily } from '../../utils/dailyRotation';

export default function TrendingStrip() {
    const { state } = useApp();
    const scrollerRef = useRef(null);

    const trendingEmojis = useMemo(() => {
        if (!state.emojis || state.emojis.length === 0) return [];
        return pickDaily(state.emojis, 24, { key: 'trending', getId: (x) => x?.emoji || x?.id });
    }, [state.emojis]);

    if (state.isLoading) return null;

    return (
        <section className="py-12 bg-dark-900/50 border-y border-white/5">
            <div className="container mx-auto px-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-orange-500">🔥</span> Trending Right Now
                </h2>
            </div>

            {/* Real horizontal scroll (trackpad/touch + mouse wheel) */}
            <div
                ref={scrollerRef}
                className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide mask-fade-sides px-4"
                onWheel={(e) => {
                    // Convert vertical wheel into horizontal scroll for mouse users
                    const el = scrollerRef.current;
                    if (!el) return;
                    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
                    el.scrollLeft += e.deltaY;
                }}
            >
                <div className="flex gap-4 w-max pb-2">
                    {trendingEmojis.map((emoji) => (
                        <div key={emoji.id} className="w-[160px] shrink-0">
                            <EmojiCard emoji={emoji} size="md" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// NOTE: horizontal scrolling is intentional; no auto-scroll animation
