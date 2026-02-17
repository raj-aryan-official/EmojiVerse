import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { Target, Layers, Download, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const StatItem = ({ icon, label, endVal, suffix = '' }) => {
    const countRef = useRef(null);

    useEffect(() => {
        if (countRef.current) {
            const countUp = new CountUp(countRef.current, endVal, {
                duration: 2.5,
                suffix: suffix,
                enableScrollSpy: true,
                scrollSpyOnce: true,
            });
            if (!countUp.error) {
                countUp.start();
            }
        }
    }, [endVal, suffix]);

    return (
        <div className="glass p-6 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-full bg-brand-500/20 text-brand-400">
                {icon}
            </div>
            <div>
                <div className="text-3xl font-bold font-display text-white" ref={countRef}>0</div>
                <div className="text-sm text-white/50 font-medium uppercase tracking-wide">{label}</div>
            </div>
        </div>
    );
};

export default function StatsBar() {
    const { state } = useApp();
    const totalEmojis = state.emojis.length || 3655;
    const totalGroups = React.useMemo(() => {
        const set = new Set();
        for (const e of state.emojis) {
            if (!e?.group) continue;
            const g = String(e.group).trim().toLowerCase();
            if (!g || g === 'others') continue;
            set.add(g);
        }
        return set.size || 54;
    }, [state.emojis]);

    return (
        <div className="container mx-auto px-4 mt-10 relative z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatItem icon={<Target size={24} />} label="Total Emojis" endVal={totalEmojis} />
                <StatItem icon={<Layers size={24} />} label="Categories" endVal={totalGroups} suffix="+" />
                <StatItem icon={<Download size={24} />} label="Copies Today" endVal={10} suffix="M+" />
                <StatItem icon={<Star size={24} />} label="Usage Cost" endVal={0} suffix=" (Free)" />
            </div>
        </div>
    );
}
