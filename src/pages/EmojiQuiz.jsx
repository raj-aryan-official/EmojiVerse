import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Timer, Trophy, RefreshCw } from 'lucide-react';
import ConfettiEffect from '../components/ui/ConfettiEffect';

export default function EmojiQuiz() {
    const { state } = useApp();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameOver, setGameOver] = useState(false);

    // Generate question
    const generateQuestion = () => {
        if (state.emojis.length < 4) return;

        const correct = state.emojis[Math.floor(Math.random() * state.emojis.length)];
        const others = [];
        while (others.length < 3) {
            const r = state.emojis[Math.floor(Math.random() * state.emojis.length)];
            if (r.id !== correct.id && !others.find(o => o.id === r.id)) {
                others.push(r);
            }
        }

        // Shuffle options
        const options = [correct, ...others].sort(() => Math.random() - 0.5);

        setCurrentQuestion({
            correct,
            options
        });
        setTimeLeft(15);
    };

    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        generateQuestion();
    };

    const handleAnswer = (emoji) => {
        if (emoji.id === currentQuestion.correct.id) {
            setScore(s => s + 1);
            generateQuestion();
        } else {
            setGameOver(true);
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isPlaying && timeLeft === 0) {
            setGameOver(true);
            setIsPlaying(false);
        }
    }, [isPlaying, timeLeft]);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-display text-white mb-2">Emoji Quiz 🎮</h1>
                <p className="text-white/60">Guess the emoji name correctly before time runs out!</p>
            </div>

            {!isPlaying && !gameOver && (
                <div className="glass p-10 text-center animate-fade-in">
                    <Trophy size={48} className="mx-auto text-yellow-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-6">Ready to play?</h2>
                    <button onClick={startGame} className="btn-primary w-full text-lg">Start Game</button>
                </div>
            )}

            {isPlaying && currentQuestion && (
                <div className="w-full space-y-6">
                    <div className="flex justify-between items-center text-lg font-bold text-white bg-dark-800 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2"><Trophy className="text-yellow-400" size={20} /> Score: {score}</div>
                        <div className="flex items-center gap-2"><Timer className={timeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-brand-400'} size={20} /> {timeLeft}s</div>
                    </div>

                    <div className="glass p-12 flex justify-center items-center">
                        <div className="text-9xl animate-pop">{currentQuestion.correct.emoji}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQuestion.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleAnswer(opt)}
                                className="p-4 bg-dark-800 border border-white/10 hover:bg-brand-600 hover:border-brand-500 rounded-xl transition-all text-white font-medium text-lg"
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {gameOver && (
                <div className="glass p-10 text-center animate-bounce-in w-full max-w-md">
                    <div className="text-6xl mb-4">💀</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>

                    <div className="my-6 p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-white/60 mb-2">The correct answer was:</p>
                        <div className="text-4xl mb-2">{currentQuestion?.correct?.emoji}</div>
                        <p className="text-xl font-bold text-brand-400">{currentQuestion?.correct?.name}</p>
                    </div>

                    <p className="text-white/60 mb-6 text-xl">Final Score: <span className="text-brand-400 font-bold">{score}</span></p>

                    <button onClick={startGame} className="btn-primary w-full flex items-center justify-center gap-2">
                        <RefreshCw size={20} /> Play Again
                    </button>
                </div>
            )}
        </div>
    );
}
