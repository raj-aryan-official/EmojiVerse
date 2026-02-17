import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../utils/constants';

export default function CategoryFilter() {
    const { state, dispatch } = useApp();

    return (
        <div className="flex gap-2 p-2 overflow-x-auto scrollbar-hide select-none">
            {CATEGORIES.map(cat => {
                const isActive = state.activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => dispatch({ type: 'SET_CATEGORY', payload: cat.id })}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-300
              ${isActive
                                ? 'bg-brand-600 border-brand-500 text-white shadow-neon-indigo scale-105'
                                : 'bg-dark-800/50 border-white/5 text-white/60 hover:bg-dark-700 hover:text-white hover:border-white/20'
                            }
            `}
                    >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-sm">{cat.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
