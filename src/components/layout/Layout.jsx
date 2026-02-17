import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import Toast from '../ui/Toast';
import ConfettiEffect from '../ui/ConfettiEffect';
import CommandPalette from '../ui/CommandPalette';
import KeyboardShortcutsModal from '../ui/KeyboardShortcutsModal';
import ScrollToTop from '../ui/ScrollToTop';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-dark-950 text-white selection:bg-brand-500/30">
            {/* Global Background Elements */}
            <div className="fixed inset-0 bg-hero-mesh opacity-20 pointer-events-none z-0" />
            <div className="fixed inset-0 noise pointer-events-none z-0 opacity-50" />

            {/* Global UI Components */}
            <ConfettiEffect />
            <Toast />
            <CommandPalette />
            <KeyboardShortcutsModal />
            <MobileMenu />
            <ScrollToTop />

            {/* Content */}
            <Navbar />
            <main className="flex-1 relative z-10 flex flex-col pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
