import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';

// Add huge emojis for visual appeal manually (or map them)
const CATEGORY_EMOJIS = {
    smileys: '😀',
    people: '👨‍👩‍👧',
    animals: '🐾',
    food: '🍕',
    travel: '✈️',
    activities: '⚽',
    objects: '💻',
    symbols: '❤️',
    flags: '🏳️',
    all: '✨',
};

export default function CategoryGrid() {
    const navigate = useNavigate();

    return (
        <section className="py-20 container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
                <h2 className="section-title text-white">Browse by Category</h2>
                <button
                    onClick={() => navigate('/browse')}
                    className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                >
                    View All →
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {CATEGORIES.slice(1).map((cat) => ( // Skip 'All'
                    <div
                        key={cat.id}
                        onClick={() => navigate(`/browse?category=${cat.id}`)}
                        className="group relative glass-hover p-8 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/0 to-brand-500/0 group-hover:from-brand-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

                        <span className="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 drop-shadow-lg">
                            {cat.icon}
                        </span>

                        <div className="text-center relative z-10">
                            <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                                {cat.name}
                            </h3>
                            <span className="text-xs text-white/40">Explore {cat.name}</span>
                        </div>

                        {/* Border gradient on hover via pseudo-like div */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-500/30 rounded-2xl transition-colors pointer-events-none" />
                    </div>
                ))}
            </div>
        </section>
    );
}
