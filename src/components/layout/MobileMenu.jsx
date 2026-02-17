import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { X, ChevronRight, LayoutGrid, Heart, Sparkles, Zap, Edit3, MessageSquare, Palette } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function MobileMenu() {
    const { state, dispatch } = useApp();
    const location = useLocation();
    const isOpen = state.isMobileMenuOpen;

    const close = () => dispatch({ type: 'TOGGLE_MOBILE_MENU', payload: false });

    // Prevent scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const links = [
        { to: '/', label: 'Home', icon: <LayoutGrid size={20} /> },
        { to: '/browse', label: 'Browse Emojis', icon: <LayoutGrid size={20} /> },
        { to: '/favorites', label: 'Favorites', icon: <Heart size={20} /> },
    ];

    const tools = [
        { to: '/tools/ai-finder', label: 'AI Finder', icon: <Sparkles size={20} /> },
        { to: '/tools/combiner', label: 'Combiner', icon: <Zap size={20} /> },
        { to: '/tools/text-generator', label: 'Text Generator', icon: <Edit3 size={20} /> },
        { to: '/tools/quiz', label: 'Emoji Quiz', icon: <MessageSquare size={20} /> },
        { to: '/tools/moodboard', label: 'Mood Board', icon: <Palette size={20} /> },
    ];

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm animate-fade-in" onClick={close} />

            <div className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-dark-900 border-l border-white/10 shadow-2xl animate-slide-in-right overflow-y-auto">
                <div className="p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display font-bold text-xl text-white">Menu</h2>
                        <button onClick={close} className="p-2 -mr-2 text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${location.pathname === link.to ? 'bg-brand-600/10 text-brand-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                            >
                                {link.icon}
                                <span className="font-medium">{link.label}</span>
                                {location.pathname === link.to && <ChevronRight className="ml-auto" size={16} />}
                            </Link>
                        ))}
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-wider px-4">Tools</h3>
                        {tools.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${location.pathname === link.to ? 'bg-brand-600/10 text-brand-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                            >
                                {link.icon}
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
