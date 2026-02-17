import React, { useState } from 'react';
import { Copy, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TextGenerator() {
    const { state } = useApp();
    const [text, setText] = useState('');
    const [mode, setMode] = useState('clap'); // clap, space, sparkle, emojify

    const generate = () => {
        if (!text.trim()) return '';

        switch (mode) {
            case 'clap':
                return text.split(' ').join(' 👏 ') + ' 👏';
            case 'space':
                return text.split('').join(' ').toUpperCase();
            case 'sparkle':
                return `✨ ${text} ✨`;
            case 'emojify':
                // Replace random words with emojis (dumb version needed because no NLP on client easily)
                // or just insert random emojis
                return text.split(' ').map(w => {
                    // simple mock replacement
                    if (w.length > 3 && Math.random() > 0.7) {
                        const randomEmoji = state.emojis[Math.floor(Math.random() * state.emojis.length)]?.emoji || '😀';
                        return `${w} ${randomEmoji}`;
                    }
                    return w;
                }).join(' ');
            default:
                return text;
        }
    };

    const result = generate();

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen max-w-3xl">
            <h1 className="text-4xl font-bold font-display text-white mb-8 text-center">Text Generator ✍️</h1>

            <div className="glass p-6 md:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Input Text</label>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="input-field min-h-[100px]"
                        placeholder="Type something here..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Style</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'clap', label: '👏 Clap' },
                            { id: 'space', label: 'S P A C E' },
                            { id: 'sparkle', label: '✨ Sparkle' },
                            { id: 'emojify', label: '🤪 Emojify' },
                        ].map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`px-4 py-2 rounded-lg border transition-all
                  ${mode === m.id
                                        ? 'bg-brand-600 border-brand-500 text-white shadow-neon-indigo'
                                        : 'bg-dark-800 border-white/10 text-white/60 hover:text-white'}
                `}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-dark-950 rounded-xl p-4 border border-white/5 relative group">
                    <div className="text-xs text-white/30 uppercase mb-2">Output</div>
                    <div className="text-xl text-white break-words min-h-[60px]">{result || '...'}</div>

                    <button
                        onClick={() => navigator.clipboard.writeText(result)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <Copy size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
