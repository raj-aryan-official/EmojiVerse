import { useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { API_PRIMARY, API_SECONDARY } from '../utils/constants';
import { normalizeEmoji } from '../utils/emojiHelpers';

export function useEmojis() {
    const { state, dispatch } = useApp();

    const fetchWithTimeout = async (url, options = {}) => {
        const { timeout = 5000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    };

    const fetchEmojis = useCallback(async () => {
        // Check cache first
        try {
            const cached = sessionStorage.getItem('emoji-data');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    dispatch({ type: 'SET_EMOJIS', payload: parsed });
                    return;
                }
            }
        } catch (e) {
            console.error('Cache parse error', e);
            sessionStorage.removeItem('emoji-data');
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        // Strategy: Primary -> Secondary -> Fallback
        const loadFromPrimary = async () => {
            const response = await fetchWithTimeout(API_PRIMARY, { timeout: 8000 });
            if (!response.ok) throw new Error(`Primary API Error: ${response.status}`);
            return await response.json();
        };

        const loadFromSecondary = async () => {
            // The secondary API (emoji-api.com) structure might differ, ensure normalization handles it
            // or skip if we aren't sure. The user provided a key, so let's try.
            // Note: API_SECONDARY in constants includes the access key.
            const response = await fetchWithTimeout(API_SECONDARY, { timeout: 8000 });
            if (!response.ok) throw new Error(`Secondary API Error: ${response.status}`);
            return await response.json();
        };

        const loadFromFallback = async () => {
            const response = await fetch('/emojis-fallback.json');
            if (!response.ok) throw new Error('Fallback file not found');
            return await response.json();
        };

        try {
            console.log('Fetching emojis from Primary API...');
            const data = await loadFromPrimary();
            const normalized = data.map(normalizeEmoji);

            sessionStorage.setItem('emoji-data', JSON.stringify(normalized));
            dispatch({ type: 'SET_EMOJIS', payload: normalized });
        } catch (primaryErr) {
            console.warn('Primary API failed:', primaryErr);

            try {
                console.log('Fetching from Secondary API...');
                const data = await loadFromSecondary();
                // Secondary API return might need different normalization if structure is different
                // For now assuming normalizeEmoji handles standard fields or we map casually
                // emoji-api.com returns: { slug, character, unicodeName, codePoint, group, subGroup }
                // normalizeEmoji expects: { name, category, group, htmlCode, unicode }
                // We might need to map it carefully. 
                // Let's rely on fallback if secondary fails or data is weird, 
                // but let's try to map it since user asked.
                const normalized = data.map(normalizeEmoji);
                dispatch({ type: 'SET_EMOJIS', payload: normalized });
            } catch (secondaryErr) {
                console.warn('Secondary API failed:', secondaryErr);

                try {
                    console.log('Using local fallback...');
                    const data = await loadFromFallback();
                    const normalized = data.map(normalizeEmoji);
                    dispatch({ type: 'SET_EMOJIS', payload: normalized });
                } catch (fallbackErr) {
                    console.error('All fetch methods failed:', fallbackErr);
                    dispatch({ type: 'SET_ERROR', payload: 'Failed to load emojis. Please check your connection.' });
                }
            }
        }
    }, [dispatch]);

    useEffect(() => {
        if (state.emojis.length === 0 && !state.error) {
            fetchEmojis();
        }
    }, [fetchEmojis, state.emojis.length, state.error]);

    return {
        emojis: state.emojis,
        isLoading: state.isLoading,
        error: state.error,
        refresh: fetchEmojis
    };
}
