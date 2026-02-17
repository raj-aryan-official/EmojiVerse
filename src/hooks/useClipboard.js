import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export function useClipboard(timeout = 2000) {
    const [isCopied, setIsCopied] = useState(false);
    const { dispatch } = useApp();

    const copy = useCallback((text, emojiObject) => {
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), timeout);

            if (emojiObject) {
                dispatch({ type: 'ADD_RECENTLY_COPIED', payload: emojiObject });
                dispatch({
                    type: 'ADD_TOAST',
                    payload: { type: 'success', message: `Copied ${emojiObject.emoji} to clipboard!`, icon: '📋' }
                });
            } else {
                dispatch({
                    type: 'ADD_TOAST',
                    payload: { type: 'success', message: 'Copied to clipboard!', icon: '✓' }
                });
            }
        }).catch(err => {
            console.error('Failed to copy!', err);
            dispatch({
                type: 'ADD_TOAST',
                payload: { type: 'error', message: 'Failed to copy', icon: '⚠️' }
            });
        });
    }, [dispatch, timeout]);

    return { isCopied, copy };
}
