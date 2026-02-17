import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-dark-900 pt-16 pb-8 overflow-hidden mt-20">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-hero-mesh opacity-10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-brand-600 rounded-lg">✨</div>
                            <h2 className="font-display font-bold text-xl text-white">EmojiVerse</h2>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed">
                            The most beautiful emoji platform on the web. Find, copy, and create with thousands of emojis.
                        </p>
                        <div className="text-xs font-mono text-white/30">
                            v1.0.0 • Made with ❤️ by RAJ ARYAN
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link to="/browse" className="hover:text-brand-400 transition-colors">Browse All</Link></li>
                            <li><Link to="/browse?sort=popular" className="hover:text-brand-400 transition-colors">Popular Emojis</Link></li>
                            <li><Link to="/browse?sort=newest" className="hover:text-brand-400 transition-colors">New Additions</Link></li>
                            <li><Link to="/favorites" className="hover:text-brand-400 transition-colors">Frequency Used</Link></li>
                        </ul>
                    </div>

                    {/* Tools */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Tools</h3>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link to="/tools/ai-finder" className="hover:text-brand-400 transition-colors">AI Emoji Finder ✨</Link></li>
                            <li><Link to="/tools/combiner" className="hover:text-brand-400 transition-colors">Emoji Combiner</Link></li>
                            <li><Link to="/tools/text-generator" className="hover:text-brand-400 transition-colors">Text Generator</Link></li>
                            <li><Link to="/tools/quiz" className="hover:text-brand-400 transition-colors">Emoji Quiz</Link></li>
                            <li><Link to="/tools/moodboard" className="hover:text-brand-400 transition-colors">Mood Board</Link></li>
                        </ul>
                    </div>

                    {/* Legal/Info */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Info</h3>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Open API</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-white/40">
                    &copy; {new Date().getFullYear()} EmojiVerse Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
