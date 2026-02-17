import { useCallback } from 'react';
import { useApp } from '../context/AppContext';

export function useFavorites() {
    const { state, dispatch } = useApp();

    const isFavorite = useCallback((id) => {
        return state.favorites.some(f => f.id === id);
    }, [state.favorites]);

    const toggleFavorite = useCallback((emoji) => {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: emoji });

        // Add confetti if it's a new favorite (handled in component usually, or here via side effect?)
        // Basic toast logic could go here, but let's keep it pure state dispatch
        const isNowFav = !isFavorite(emoji.id);
        if (isNowFav) {
            dispatch({
                type: 'ADD_TOAST',
                payload: { type: 'success', message: `Added ${emoji.emoji} to favorites`, icon: '❤️' }
            });
            // Trigger confetti if milestone (1st, 10th...) - simplified check
            if (state.favorites.length + 1 === 1 || (state.favorites.length + 1) % 10 === 0) {
                // Dispatch logic for confetti would be nice, but easier to do in UI component
            }
        } else {
            dispatch({
                type: 'ADD_TOAST',
                payload: { type: 'info', message: 'Removed from favorites', icon: '💔' }
            });
        }
    }, [dispatch, isFavorite, state.favorites.length]);

    return { favorites: state.favorites, isFavorite, toggleFavorite };
}
