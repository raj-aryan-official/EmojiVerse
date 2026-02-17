import React, { useRef, useEffect } from 'react';
import { Copy, Heart, Download, Code, FileCode, Hash, Eye } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useClipboard } from '../../hooks/useClipboard';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function EmojiContextMenu({ emoji, position, onClose }) {
    const menuRef = useRef(null);
    const { isFavorite, toggleFavorite } = useFavorites();
    const { copy } = useClipboard();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is on a trigger button to prevent immediate reopening/closing conflict
            // For now simple reliable check
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        // Block scroll when open? No, better to close on scroll
        const handleScroll = () => onClose();

        window.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onClose]);

    const handleAction = (action) => {
        action();
        onClose();
    };

    if (!position) return null;

    // Adjust placement to keep in viewport (rudimentary)
    const style = {
        top: Math.min(position.y, window.innerHeight - 300),
        left: Math.min(position.x, window.innerWidth - 250),
    };

    return createPortal(
        <div
            ref={menuRef}
            style={style}
            className="fixed z-50 w-56 bg-dark-800/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl animate-fade-in flex flex-col p-1 origin-top-left"
        >
            <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded uppercase truncate max-w-[150px]">
                    {emoji.emoji} {emoji.name}
                </span>
            </div>

            <div className="flex flex-col p-1 gap-0.5">
                <button className="context-item" onClick={() => handleAction(() => copy(emoji.emoji, emoji))}>
                    <Copy size={16} /> Copy Emoji
                </button>
                <button className="context-item" onClick={() => handleAction(() => toggleFavorite(emoji))}>
                    <Heart size={16} className={isFavorite(emoji.id) ? 'fill-pink-500 text-pink-500' : ''} />
                    {isFavorite(emoji.id) ? 'Remove Favorite' : 'Add to Favorites'}
                </button>
            </div>

            <div className="h-px bg-white/5 my-1" />

            <div className="flex flex-col p-1 gap-0.5">
                <button className="context-item" onClick={() => handleAction(() => copy(emoji.unicode, emoji))}>
                    <Hash size={16} /> Copy Unicode
                </button>
                <button className="context-item" onClick={() => handleAction(() => copy(emoji.htmlCode, emoji))}>
                    <Code size={16} /> Copy HTML
                </button>
                <button className="context-item" onClick={() => handleAction(() => copy(emoji.cssCode, emoji))}>
                    <FileCode size={16} /> Copy CSS
                </button>
            </div>

            <div className="h-px bg-white/5 my-1" />

            <div className="flex flex-col p-1 gap-0.5">
                <button className="context-item" onClick={() => handleAction(() => navigate(`/emoji/${emoji.id}`))}>
                    <Eye size={16} /> View Details
                </button>
                <button className="context-item opacity-50 cursor-not-allowed">
                    <Download size={16} /> Download PNG
                </button>
            </div>
        </div>,
        document.body
    );
}
