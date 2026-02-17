import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="bg-dark-700/50 rounded-2xl p-4 flex flex-col gap-3 min-h-[120px] animate-pulse border border-white/5">
            <div className="h-4 w-4 rounded-full bg-white/5 self-end" />
            <div className="h-12 w-12 rounded-full bg-white/5 self-center mx-auto" />
            <div className="h-3 w-3/4 rounded-full bg-white/5 self-center" />
        </div>
    );
}
