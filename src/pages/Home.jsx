import React from 'react';
import Hero from '../components/home/Hero';
import StatsBar from '../components/home/StatsBar';
import CategoryGrid from '../components/home/CategoryGrid';
import TrendingStrip from '../components/home/TrendingStrip';
import FeaturedSection from '../components/home/FeaturedSection';
import Footer from '../components/layout/Footer';

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />
            <StatsBar />
            <TrendingStrip />
            <CategoryGrid />
            <FeaturedSection />

            {/* Newsletter / Final CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-600/10 -skew-y-3 transform" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl font-display font-bold mb-6">Ready to find your vibe?</h2>
                    <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                        Start exploring the collection or use our AI tools to find exactly what you need.
                    </p>
                    <a href="/browse" className="btn-primary inline-flex items-center gap-2 text-lg">
                        Get Started Now 🚀
                    </a>
                </div>
            </section>
        </div>
    );
}
