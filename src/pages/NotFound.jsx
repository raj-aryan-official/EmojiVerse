import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <div className="text-9xl mb-4 animate-bounce">🤔</div>
            <h1 className="text-4xl font-bold font-display text-white mb-2">Page Not Found</h1>
            <p className="text-white/50 mb-8">The emoji you are looking for has floated away.</p>
            <Link to="/" className="btn-primary">Return Home</Link>
        </div>
    );
}
