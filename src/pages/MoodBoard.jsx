import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Trash2, Plus, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useDebounce } from '../hooks/useDebounce';

export default function MoodBoard() {
    const { state } = useApp();
    const [boardEmojis, setBoardEmojis] = useState([]); // { id, emoji, x, y, size }
    const [selectedId, setSelectedId] = useState(null);
    const boardRef = useRef(null);
    const [bgColor, setBgColor] = useState('#161624');
    const [paletteQuery, setPaletteQuery] = useState('');
    const debouncedPaletteQuery = useDebounce(paletteQuery, 150);

    const paletteResults = useMemo(() => {
        const q = (debouncedPaletteQuery || '').trim().toLowerCase();
        if (!state.emojis || state.emojis.length === 0) return [];
        if (!q) return state.emojis;

        return state.emojis.filter((e) => {
            const name = (e?.name || '').toLowerCase();
            const displayName = (e?.displayName || '').toLowerCase();
            const group = (e?.group || '').toLowerCase();
            const originalCategory = (e?.originalCategory || '').toLowerCase();
            const keywords = Array.isArray(e?.keywords) ? e.keywords.map(k => String(k || '').toLowerCase()) : [];
            return (
                name.includes(q) ||
                displayName.includes(q) ||
                group.includes(q) ||
                originalCategory.includes(q) ||
                keywords.some(k => k.includes(q))
            );
        });
    }, [state.emojis, debouncedPaletteQuery]);

    const addEmoji = (emoji) => {
        const newEmoji = {
            id: Date.now(),
            emoji: emoji.emoji,
            x: Math.random() * (800 - 64),
            y: Math.random() * (500 - 64),
            size: 64,
            rotation: 0
        };
        setBoardEmojis([...boardEmojis, newEmoji]);
        setSelectedId(newEmoji.id);
    };

    const handleDownload = async () => {
        if (!boardRef.current) return;
        try {
            const canvas = await html2canvas(boardRef.current, {
                backgroundColor: bgColor,
                scale: 2, // Higher resolution
            });
            const link = document.createElement('a');
            link.download = 'emojiverse-moodboard.png';
            link.href = canvas.toDataURL();
            link.click();
        } catch (err) {
            console.error('Failed to download moodboard:', err);
            alert('Failed to save mood board. Please try again.');
        }
    };

    // ... (rest of the component)

    // Simplified drag handlers for brevity in replacement if I could, but I need to replace the whole file or chunk.
    // I will replace the whole file to be safe and clean.

    const handleDragStart = (e, id) => {
        setSelectedId(id);
        e.dataTransfer.setData('id', id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const id = Number(e.dataTransfer.getData('id'));
        if (!id) return;

        const rect = boardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setBoardEmojis(prev => prev.map(item =>
            item.id === id ? { ...item, x: x - item.size / 2, y: y - item.size / 2 } : item
        ));
    };

    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging && selectedId) {
            const rect = boardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setBoardEmojis(prev => prev.map(item =>
                item.id === selectedId ? { ...item, x: x - item.size / 2, y: y - item.size / 2 } : item
            ));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleDelete = () => {
        if (selectedId) {
            setBoardEmojis(prev => prev.filter(e => e.id !== selectedId));
            setSelectedId(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold font-display text-white mb-6">Mood Board 🎨</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Palette Sidebar */}
                <div className="w-full lg:w-80 h-[600px] flex flex-col gap-4 min-w-0">
                    <div className="glass p-4 space-y-3">
                        <div className="text-xs font-bold uppercase text-white/50 tracking-wider">
                            Click to add • Drag inside board to move
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                value={paletteQuery}
                                onChange={(e) => setPaletteQuery(e.target.value)}
                                placeholder="Search emojis..."
                                className="flex-1 bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500/50"
                            />
                            {paletteQuery && (
                                <button
                                    onClick={() => setPaletteQuery('')}
                                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="text-xs text-white/40">
                            Showing <span className="text-white/70 font-semibold">{paletteResults.length}</span> emojis
                        </div>
                    </div>

                    <div className="glass flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {state.isLoading ? (
                            <div className="text-sm text-white/40 p-4">Loading emojis…</div>
                        ) : paletteResults.length === 0 ? (
                            <div className="text-sm text-white/40 p-4">No emojis found for “{paletteQuery}”.</div>
                        ) : (
                            <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-8 gap-1.5 content-start">
                                {paletteResults.map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => addEmoji(e)}
                                        className="aspect-square text-xl sm:text-2xl rounded-lg hover:bg-white/10 transition-colors"
                                        title={e.displayName || e.name}
                                    >
                                        {e.emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Board Area */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Toolbar */}
                    <div className="glass p-3 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button onClick={handleDelete} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg disabled:opacity-50" disabled={!selectedId}>
                                <Trash2 size={20} />
                            </button>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={e => setBgColor(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                            />
                        </div>
                        <button
                            onClick={handleDownload}
                            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                        >
                            <Download size={16} /> Download
                        </button>
                    </div>

                    <div
                        ref={boardRef}
                        className="w-full h-[600px] border border-white/10 rounded-2xl relative overflow-hidden shadow-2xl transition-colors duration-300"
                        style={{ backgroundColor: bgColor }}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {boardEmojis.map(item => (
                            <div
                                key={item.id}
                                className={`absolute cursor-move select-none text-[64px] transition-transform hover:scale-110 active:scale-105
                      ${selectedId === item.id ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}
                    `}
                                style={{ left: item.x, top: item.y }}
                                onMouseDown={(e) => handleMouseDown(e, item.id)}
                            >
                                {item.emoji}
                            </div>
                        ))}

                        {boardEmojis.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-3xl font-bold uppercase tracking-widest pointer-events-none">
                                Drag Emojis Here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
