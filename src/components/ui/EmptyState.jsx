import React from 'react';

export default function EmptyState({ icon = '🔍', title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-fade-in">
            <div className="text-6xl mb-4 animate-float">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">{title}</h3>
            <p className="text-white/50 max-w-md mb-6">{description}</p>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
}
