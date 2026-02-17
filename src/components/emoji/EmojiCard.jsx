import React, { useState } from 'react';
import { Heart, MoreVertical, Palette } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useClipboard } from '../../hooks/useClipboard';
import { useNavigate } from 'react-router-dom';
import EmojiContextMenu from './EmojiContextMenu';
import SkinTonePicker from './SkinTonePicker';
import { useApp } from '../../context/AppContext';

export default function EmojiCard({ emoji, size = 'md' }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { copy, isCopied } = useClipboard();
    const { state } = useApp();
    const navigate = useNavigate();

    const [contextMenuPos, setContextMenuPos] = useState(null);
    const [skinTonePos, setSkinTonePos] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    // Size classes
    const sizeClasses = {
        sm: { card: 'p-2 min-h-[80px]', text: 'text-2xl', name: 'text-[10px]' },
        md: { card: 'p-4 min-h-[120px]', text: 'text-5xl', name: 'text-xs' },
        lg: { card: 'p-6 min-h-[160px]', text: 'text-6xl', name: 'text-sm' },
    };
    const currentSize = sizeClasses[size] || sizeClasses.md;

    const handleRightClick = (e) => {
        e.preventDefault();
        setContextMenuPos({ x: e.clientX, y: e.clientY });
    };

    const handleCopy = () => {
        copy(emoji.emoji, emoji);
    };

    const isFav = isFavorite(emoji.id);

    return (
        <>
            <div
                className={`
          emoji-card group relative
          ${currentSize.card}
          ${isFav ? 'bg-pink-500/5 border-pink-500/20' : ''}
          ${isCopied ? 'border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : ''}
        `}
                onClick={handleCopy}
                onContextMenu={handleRightClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="button"
                tabIndex={0}
            >
                {/* Top Actions Overlay */}
                <div className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${isHovered || isFav ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Skin Tone Trigger (if applicable, logic needed to check support) */}
                    {/* {emoji.hasSkinTones && (
             <button 
               className="p-1.5 rounded-lg bg-dark-900/50 hover:bg-brand-500 text-white/70 hover:text-white"
               onClick={(e) => { e.stopPropagation(); setSkinTonePos({ x: e.clientX, y: e.clientY }); }}
             >
               <Palette size={14} />
             </button>
           )} */}

                    <button
                        className={`p-1.5 rounded-lg transition-colors ${isFav ? 'text-pink-500' : 'bg-dark-900/50 hover:bg-pink-500 hover:text-white text-white/50'}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(emoji); }}
                    >
                        <Heart size={14} className={isFav ? 'fill-current' : ''} />
                    </button>

                    <button
                        className="p-1.5 rounded-lg bg-dark-900/50 hover:bg-white/20 text-white/70"
                        onClick={(e) => { e.stopPropagation(); setContextMenuPos({ x: e.clientX, y: e.clientY }); }}
                    >
                        <MoreVertical size={14} />
                    </button>
                </div>

                {/* New Badge */}
                {emoji.isNew && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-brand-500 text-[9px] font-bold text-white shadow-lg">
                        NEW
                    </div>
                )}

                {/* Content (no absolute positioning to prevent overlap) */}
                <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center pt-6">
                    {/* Emoji */}
                    <div
                        className={`
              transform transition-transform duration-300
              ${currentSize.text}
              ${isHovered ? 'scale-110 drop-shadow-2xl' : 'scale-100'}
              ${isCopied ? 'animate-emoji-pop' : ''}
            `}
                    >
                        {emoji.emoji}
                    </div>
                </div>

                {/* Name */}
                <div
                    className={`
            mt-1 w-full text-center px-2 text-white/50 font-medium
            ${currentSize.name}
            line-clamp-2 leading-tight
            group-hover:text-white/95 transition-colors
          `}
                >
                    {emoji.displayName || emoji.name}
                </div>
            </div>

            {/* Portals/Modals */}
            <EmojiContextMenu
                emoji={emoji}
                position={contextMenuPos}
                onClose={() => setContextMenuPos(null)}
            />
            <SkinTonePicker
                position={skinTonePos}
                onClose={() => setSkinTonePos(null)}
            />
        </>
    );
}
