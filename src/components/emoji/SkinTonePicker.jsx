import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Check } from 'lucide-react';
import { createPortal } from 'react-dom';

const SKIN_TONES = [
    { id: 0, color: '#fbbf24', name: 'Default' }, // Yellow
    { id: 1, color: '#f7dece', name: 'Light' },
    { id: 2, color: '#f3cba6', name: 'Medium-Light' },
    { id: 3, color: '#d0aa8b', name: 'Medium' },
    { id: 4, color: '#9d7c5f', name: 'Medium-Dark' },
    { id: 5, color: '#5e4839', name: 'Dark' },
];

export default function SkinTonePicker({ position, onClose }) {
    const { state, dispatch } = useApp();
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };
        const handleScroll = () => onClose();
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onClose]);

    if (!position) return null;

    return createPortal(
        <div
            ref={ref}
            style={{ top: position.y, left: position.x }}
            className="fixed z-50 p-2 bg-dark-800/90 backdrop-blur border border-white/10 rounded-xl shadow-xl flex gap-1 animate-scale-in"
        >
            {SKIN_TONES.map(tone => (
                <button
                    key={tone.id}
                    onClick={() => {
                        dispatch({ type: 'SET_SKIN_TONE', payload: tone.id });
                        onClose();
                    }}
                    className="relative w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform flex items-center justify-center"
                    style={{ backgroundColor: tone.color }}
                    title={tone.name}
                >
                    {state.preferredSkinTone === tone.id && (
                        <Check size={14} className="text-black/70 drop-shadow-sm" />
                    )}
                </button>
            ))}
        </div>,
        document.body
    );
}
