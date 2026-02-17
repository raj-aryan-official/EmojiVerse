import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from './Modal';
import { Command, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X } from 'lucide-react';

export default function KeyboardShortcutsModal() {
    const { state, dispatch } = useApp();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === '?' && !state.isCommandPaletteOpen && e.target.tagName !== 'INPUT') {
                dispatch({ type: 'TOGGLE_KEYBOARD_SHORTCUTS' });
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [state.isCommandPaletteOpen, dispatch]);

    const shortcuts = [
        { keys: ['⌘', 'K'], label: 'Open Command Palette' },
        { keys: ['?'], label: 'Toggle Shortcuts' },
        { keys: ['/'], label: 'Focus Search' },
        { keys: ['Esc'], label: 'Close Modals' },
        { keys: ['←', '→'], label: 'Navigate Grid' },
        { keys: ['Enter'], label: 'Copy Emoji' },
    ];

    return (
        <Modal
            isOpen={state.isKeyboardShortcutsOpen}
            onClose={() => dispatch({ type: 'TOGGLE_KEYBOARD_SHORTCUTS', payload: false })}
            title="Keyboard Shortcuts"
        >
            <div className="grid grid-cols-1 gap-1 p-4">
                {shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
                        <span className="text-white/70">{s.label}</span>
                        <div className="flex gap-1">
                            {s.keys.map((k, j) => (
                                <kbd key={j} className="px-2 py-1 bg-dark-800 border border-white/10 rounded-md text-sm font-mono text-white min-w-[32px] text-center shadow-sm">
                                    {k}
                                </kbd>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
