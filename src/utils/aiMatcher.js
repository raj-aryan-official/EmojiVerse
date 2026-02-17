export const KEYWORD_DICTIONARY = {
    happy: ['smile', 'grin', 'joy', 'laugh', 'excited', 'glad', 'pleasant', 'delighted'],
    sad: ['cry', 'tear', 'unhappy', 'depressed', 'gloomy', 'miserable', 'heartbroken'],
    love: ['heart', 'kiss', 'affection', 'romance', 'crush', 'adorable', 'sweet'],
    angry: ['mad', 'rage', 'furious', 'annoyed', 'irritated', 'pouting'],
    surprised: ['shock', 'startled', 'amazed', 'astonished', 'wow', 'omg'],
    funny: ['lol', 'rofl', 'lmao', 'joke', 'hilarious', 'silly', 'clown'],
    cool: ['sunglasses', 'chill', 'awesome', 'dope', 'rad', 'stylish'],
    scary: ['ghost', 'fear', 'fright', 'spooky', 'horror', 'scream', 'scared'],
    tired: ['sleep', 'drowsy', 'exhausted', 'weary', 'fatigue', 'bed'],
    food: ['hungry', 'eat', 'delicious', 'yum', 'tasty', 'snack', 'meal'],
    party: ['celebrate', 'confetti', 'dance', 'fun', 'event', 'birthday'],
};

export const matchEmojisToMood = (inputText, emojis) => {
    const text = inputText.toLowerCase();
    const words = text.split(/\W+/); // Split by non-word chars

    // Score each emoji based on keyword matches
    const scores = emojis.map(emoji => {
        let score = 0;
        let reasons = [];

        // Direct name match
        if (text.includes(emoji.name)) {
            score += 10;
            reasons.push('matches name directly');
        }

        // Category dictionary match
        Object.entries(KEYWORD_DICTIONARY).forEach(([category, keywords]) => {
            // If input text contains a keyword from this category
            const hit = keywords.some(k => text.includes(k));
            if (hit) {
                // Boost emojis that belong to this category/mood context
                // Simplified check: if emoji name contains relevant keywords
                const emojiMatchesCategory = keywords.some(k => emoji.name.includes(k));
                if (emojiMatchesCategory) {
                    score += 5;
                    reasons.push(`matches mood "${category}"`);
                }
            }
        });

        // Word overlap match
        emoji.keywords.forEach(keyword => {
            if (words.includes(keyword)) {
                score += 2;
            }
        });

        return { ...emoji, matchScore: score, matchReason: reasons.join(', ') };
    });

    // Filter and sort by score
    return scores
        .filter(e => e.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 12); // Top 12
};
