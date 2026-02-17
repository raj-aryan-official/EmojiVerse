import React from 'react';
import { useApp } from '../context/AppContext';
import { useFavorites } from '../hooks/useFavorites';
import EmojiCard from '../components/emoji/EmojiCard';
import EmptyState from '../components/ui/EmptyState';
import { Download, Upload, Share2, Trash2 } from 'lucide-react';

export default function Favorites() {
    const { state } = useApp();
    const { favorites } = useFavorites(); // just for clarity, state.favorites is same

    const handleExport = () => {
        const data = JSON.stringify(favorites, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'emojiverse-favorites.json';
        link.click();
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (Array.isArray(imported)) {
                        // Dispatch logic to merge or replace
                        // For now simpler: iterate and toggle? 
                        // Ideally we have a SET_FAVORITES action but we only have TOGGLE
                        console.log('Imported:', imported);
                        alert('Import feature coming soon! (requires reducer update)');
                    }
                } catch (err) {
                    alert('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    if (favorites.length === 0) {
        return (
            <EmptyState
                icon="❤️"
                title="No favorites yet"
                description="Start adding emojis to your collection by clicking the heart icon."
                action={<a href="/browse" className="btn-primary mt-4 inline-block">Browse Emojis</a>}
            />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold font-display text-white">Your Favorites</h1>
                    <span className="bg-brand-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {favorites.length}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleExport} className="btn-ghost flex items-center gap-2 text-sm">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={handleImport} className="btn-ghost flex items-center gap-2 text-sm">
                        <Upload size={16} /> Import
                    </button>
                    <button className="btn-ghost flex items-center gap-2 text-sm">
                        <Share2 size={16} /> Share
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favorites.map(emoji => (
                    <EmojiCard key={emoji.id} emoji={emoji} size={state.emojiSize} />
                ))}
            </div>
        </div>
    );
}
