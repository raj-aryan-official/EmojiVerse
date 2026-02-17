import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import EnhancedEmojiPicker from '../components/emoji/EmojiSearch'; // Reusing search for now or build simple picker
import Modal from '../components/ui/Modal';
import EmojiGrid from '../components/emoji/EmojiGrid'; // Too heavy?
import { Plus, ArrowRight, RefreshCw, Copy, Share2 } from 'lucide-react';

// Simplified Picker for the combiner
const MiniPicker = ({ onSelect, onClose }) => {
    const { state } = useApp();
    const [search, setSearch] = useState('');

    const q = search.trim().toLowerCase();
    const filtered = state.emojis
        .filter(e => {
            if (!q) return true;
            const name = (e?.name || '').toLowerCase();
            const displayName = (e?.displayName || '').toLowerCase();
            const group = (e?.group || '').toLowerCase();
            return name.includes(q) || displayName.includes(q) || group.includes(q);
        })
        .slice(0, 60);

    return (
        <div className="h-[400px] flex flex-col">
            <input
                autoFocus
                className="bg-dark-800 p-3 rounded-lg border border-white/10 w-full mb-4 focus:border-brand-500 outline-none"
                placeholder="Search emoji..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-2">
                {filtered.map(e => (
                    <button
                        key={e.id}
                        onClick={() => onSelect(e)}
                        className="text-2xl p-2 hover:bg-white/10 rounded"
                        title={e.name}
                    >
                        {e.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function EmojiCombiner() {
    const { state } = useApp();
    const [leftEmoji, setLeftEmoji] = useState(null);
    const [rightEmoji, setRightEmoji] = useState(null);
    const [isPickerOpen, setIsPickerOpen] = useState(null); // 'left' or 'right'

    const handleSelect = (emoji) => {
        if (isPickerOpen === 'left') setLeftEmoji(emoji);
        if (isPickerOpen === 'right') setRightEmoji(emoji);
        setIsPickerOpen(null);
    };

    const combined = leftEmoji && rightEmoji ? `${leftEmoji.emoji}${rightEmoji.emoji}` : '?';

    const comboSuggestions = useMemo(() => {
        if (!leftEmoji || !rightEmoji || !state.emojis || state.emojis.length === 0) return [];

        const leftTokens = new Set([
            ...(leftEmoji.keywords || []),
            ...(String(leftEmoji.name || '').split(/\W+/)),
            ...(String(leftEmoji.displayName || '').split(/\W+/)),
        ].map(s => String(s || '').toLowerCase()).filter(Boolean));

        const rightTokens = new Set([
            ...(rightEmoji.keywords || []),
            ...(String(rightEmoji.name || '').split(/\W+/)),
            ...(String(rightEmoji.displayName || '').split(/\W+/)),
        ].map(s => String(s || '').toLowerCase()).filter(Boolean));

        // remove extremely common noise tokens
        const stop = new Set(['and', 'with', 'of', 'the', 'face', 'person', 'people']);
        for (const t of stop) {
            leftTokens.delete(t);
            rightTokens.delete(t);
        }

        const candidates = [];
        for (const e of state.emojis) {
            if (!e?.id) continue;
            if (e.id === leftEmoji.id || e.id === rightEmoji.id) continue;

            const hay = `${e.name || ''} ${e.displayName || ''} ${e.group || ''} ${e.originalCategory || ''}`.toLowerCase();
            const keys = Array.isArray(e.keywords) ? e.keywords.map(k => String(k || '').toLowerCase()) : [];

            let leftHits = 0;
            let rightHits = 0;

            for (const t of leftTokens) {
                if (hay.includes(t) || keys.some(k => k.includes(t))) leftHits++;
            }
            for (const t of rightTokens) {
                if (hay.includes(t) || keys.some(k => k.includes(t))) rightHits++;
            }

            // Must match something from BOTH sides to be a "combo"
            if (leftHits === 0 || rightHits === 0) continue;

            const score = leftHits * 3 + rightHits * 3;
            candidates.push({ e, score });
        }

        candidates.sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name));
        return candidates.slice(0, 12).map(x => x.e);
    }, [leftEmoji, rightEmoji, state.emojis]);

    const bestMatch = comboSuggestions[0] || null;

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-bold font-display text-white mb-2">Emoji Combiner 🧩</h1>
            <p className="text-white/60 mb-12">Mix two emojis to create the perfect combo.</p>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left Slot */}
                <button
                    onClick={() => setIsPickerOpen('left')}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95
              ${leftEmoji ? 'border-brand-500 bg-brand-500/10' : 'border-white/20 hover:border-white/40'}
            `}
                >
                    {leftEmoji ? (
                        <span className="text-6xl md:text-7xl animate-pop text-shadow-lg">{leftEmoji.emoji}</span>
                    ) : (
                        <>
                            <Plus className="text-white/30 mb-2" />
                            <span className="text-xs text-white/50">Select</span>
                        </>
                    )}
                </button>

                <Plus className="text-white/20" size={32} />

                {/* Right Slot */}
                <button
                    onClick={() => setIsPickerOpen('right')}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95
              ${rightEmoji ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-white/40'}
            `}
                >
                    {rightEmoji ? (
                        <span className="text-6xl md:text-7xl animate-pop">{rightEmoji.emoji}</span>
                    ) : (
                        <>
                            <Plus className="text-white/30 mb-2" />
                            <span className="text-xs text-white/50">Select</span>
                        </>
                    )}
                </button>
            </div>

            {/* Result */}
            <div className="mt-12 bg-dark-800/50 p-8 rounded-2xl border border-white/5 flex flex-col items-center gap-6 w-full max-w-md">
                <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Result</div>
                <div className="text-8xl animate-bounce-in">{bestMatch ? bestMatch.emoji : combined}</div>
                {bestMatch && (
                    <div className="text-center">
                        <div className="text-white/80 font-semibold">{bestMatch.displayName || bestMatch.name}</div>
                        <div className="text-xs text-white/40 mt-1">Likely combo result (changes based on your selection)</div>
                        <div className="text-xs text-white/40 mt-2">
                            Inputs: <span className="text-white/70">{combined}</span>
                        </div>
                    </div>
                )}

                {leftEmoji && rightEmoji && comboSuggestions.length > 1 && (
                    <div className="w-full">
                        <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">More suggestions</div>
                        <div className="grid grid-cols-6 gap-2">
                            {comboSuggestions.slice(0, 12).map(s => (
                                <button
                                    key={`combo-${s.id}`}
                                    className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-2xl"
                                    onClick={() => navigator.clipboard.writeText(s.emoji)}
                                    title={s.displayName || s.name}
                                >
                                    {s.emoji}
                                </button>
                            ))}
                        </div>
                        <div className="text-[10px] text-white/30 mt-2">Tip: click a suggestion to copy it.</div>
                    </div>
                )}

                <div className="flex gap-2 w-full">
                    <button
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                        onClick={() => navigator.clipboard.writeText(bestMatch ? bestMatch.emoji : combined)}
                        disabled={!leftEmoji || !rightEmoji}
                    >
                        <Copy size={18} /> Copy
                    </button>
                    <button
                        className="btn-ghost flex-1 flex items-center justify-center gap-2"
                        onClick={() => { setLeftEmoji(null); setRightEmoji(null); }}
                    >
                        <RefreshCw size={18} /> Reset
                    </button>
                </div>
            </div>

            <Modal
                isOpen={!!isPickerOpen}
                onClose={() => setIsPickerOpen(null)}
                title={`Select ${isPickerOpen === 'left' ? 'First' : 'Second'} Emoji`}
            >
                <div className="p-4">
                    <MiniPicker onSelect={handleSelect} onClose={() => setIsPickerOpen(null)} />
                </div>
            </Modal>
        </div>
    );
}
