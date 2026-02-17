import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export default function ConfettiEffect() {
    const { state } = useApp();

    // Track previous favorites count to trigger on new add
    const prevFavCountRef = React.useRef(state.favorites.length);

    useEffect(() => {
        const prevCount = prevFavCountRef.current;
        if (state.favorites.length > prevCount) {
            const isMilestone = state.favorites.length === 1 || state.favorites.length % 10 === 0;
            if (isMilestone) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#a855f7', '#06b6d4', '#ec4899']
                });
            }
        }
        prevFavCountRef.current = state.favorites.length;
    }, [state.favorites.length]);

    return null; // Logic only component
}
