import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useFavorites } from '../hooks/useFavorites';
import { useClipboard } from '../hooks/useClipboard';
import { ChevronLeft, Copy, Check, Download, Share2, Heart } from 'lucide-react';
import EmojiCard from '../components/emoji/EmojiCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { normalizeEmoji } from '../utils/emojiHelpers';

// Download Utility Helper inside component or import
const downloadEmojiAsPNG = (emojiChar, filename) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);
    ctx.font = '400px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'; // Fallback fonts
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojiChar, 256, 280); // slight offset adjust
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
};

const CodeRow = ({ label, value }) => {
    const { copy, isCopied } = useClipboard(1000);
    // We need local copied state for each row to show individual checkmarks, using hook in a map is tricky
    // Simplified: Global copy feedback is fine, or use separate component.
    // Let's us separate component for row.
    return <CodeRowItem label={label} value={value} />;
};

const CodeRowItem = ({ label, value }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-white/5">
            <div className="flex items-center gap-4">
                <span className="text-white/40 text-sm w-24">{label}</span>
                <code className="text-brand-300 font-mono text-sm">{value}</code>
            </div>
            <button
                onClick={handleCopy}
                className="p-1.5 text-white/40 hover:text-white transition-colors"
            >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
        </div>
    );
};

export default function EmojiDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useApp();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [emoji, setEmoji] = useState(null);

    // Find emoji from state
    useEffect(() => {
        if (state.emojis.length > 0) {
            const found = state.emojis.find(e => e.id === slug);
            if (found) {
                setEmoji(found);
                // Add to history
                dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: found });
            } else {
                // Fetch or redirect? Maybe search by slug if ID logic differs
                // For now assume ID = Slug
            }
        }
    }, [slug, state.emojis, dispatch]);

    if (!emoji) return <div className="p-20 text-center"><SkeletonCard /></div>;

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back to Browse
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Preview */}
                <div className="bg-dark-800/50 rounded-[3rem] border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px] glass">
                    <div className="absolute inset-0 bg-hero-mesh opacity-20 animate-pulse-glow" />
                    <div className="text-[12rem] md:text-[16rem] animate-float drop-shadow-2xl relative z-10 transition-transform hover:scale-110 duration-300 cursor-default select-none">
                        {emoji.emoji}
                    </div>
                    {/* Skin Tones Preview Row if existing */}
                </div>

                {/* Right: Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 text-white/50 mb-2 text-sm">
                            <span>{emoji.originalCategory}</span>
                            <span>›</span>
                            <span>{emoji.group}</span>
                        </div>
                        <h1 className="text-5xl font-display font-bold text-white mb-4">{emoji.displayName}</h1>
                        <p className="text-white/60 text-lg">
                            The <span className="text-white font-bold">"{emoji.displayName}"</span> emoji,
                            Unicode: <span className="font-mono bg-white/10 px-1 rounded">{emoji.unicode}</span>.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => toggleFavorite(emoji)}
                            className={`btn-ghost flex-1 flex items-center justify-center gap-2 border-brand-500/30 ${isFavorite(emoji.id) ? 'bg-pink-500/20 text-pink-400 border-pink-500/50' : ''}`}
                        >
                            <Heart className={isFavorite(emoji.id) ? 'fill-current' : ''} />
                            {isFavorite(emoji.id) ? 'Favorited' : 'Add to Favorites'}
                        </button>
                        <button
                            onClick={() => downloadEmojiAsPNG(emoji.emoji, `${emoji.id}.png`)}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            <Download /> Download PNG
                        </button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-white">Technical Details</h3>
                        <CodeRow label="Unicode" value={emoji.unicode} />
                        <CodeRow label="HTML Code" value={emoji.htmlCode} />
                        <CodeRow label="CSS Code" value={emoji.cssCode} />
                        <CodeRow label="Shortcode" value={`:${emoji.id}:`} />
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-3">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {emoji.keywords.map(k => (
                                <span key={k} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm text-white/60 hover:bg-white/10 cursor-pointer">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Emojis */}
            <div className="mt-20">
                <h2 className="section-title text-white mb-8">You might also like</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {state.emojis
                        .filter(e => e.category === emoji.category && e.id !== emoji.id)
                        .slice(0, 12)
                        .map(e => <EmojiCard key={e.id} emoji={e} size="md" />)
                    }
                </div>
            </div>
        </div>
    );
}
