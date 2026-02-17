import React, { useMemo } from 'react';

const FLOATING_EMOJIS = ['😀', '🚀', '✨', '🎉', '🔥', '💎', '🌈', '🍕', '👾', '🦄', '🎈', '⚡', '🌟', '🎨', '🏖️', '🍩', '🍦', '🪐', '🔮', '🧸'];

export default function FloatingEmojis() {
    // Generate random positions and animations once
    const emojis = useMemo(() => {
        return FLOATING_EMOJIS.map((emoji, index) => ({
            emoji,
            id: index,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 40 + 20 + 'px', // 20-60px
            animationDuration: Math.random() * 10 + 10 + 's', // 10-20s slow float
            delay: Math.random() * 5 + 's',
            opacity: Math.random() * 0.15 + 0.05, // 0.05 - 0.2
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {emojis.map((item) => (
                <div
                    key={item.id}
                    className="absolute animate-float blur-[1px]"
                    style={{
                        left: item.left,
                        top: item.top,
                        fontSize: item.size,
                        opacity: item.opacity,
                        animationDuration: item.animationDuration,
                        animationDelay: item.delay,
                    }}
                >
                    {item.emoji}
                </div>
            ))}
        </div>
    );
}
