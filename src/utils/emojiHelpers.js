import { MAX_RECENT_COPIES, MAX_RECENT_HISTORY } from './constants';

export const normalizeEmoji = (apiEmoji) => {
    // 1. Determine Name
    const name = apiEmoji.name || apiEmoji.unicodeName || apiEmoji.slug || 'unknown';

    // 2. Determine Category & Group
    // EmojiAPI uses 'group' as category-like and 'subGroup' as group-like
    let categorySource = apiEmoji.category;
    if (!categorySource && apiEmoji.group) categorySource = apiEmoji.group;
    const category = (categorySource || 'others').toLowerCase();

    const group = (apiEmoji.group || apiEmoji.subGroup || 'others').toLowerCase();

    // 3. Determine Codes
    const htmlCode = apiEmoji.htmlCode && apiEmoji.htmlCode.length > 0 ? apiEmoji.htmlCode[0] : '';
    let unicode = apiEmoji.unicode && apiEmoji.unicode.length > 0 ? apiEmoji.unicode[0] : '';
    if (!unicode && apiEmoji.codePoint) unicode = `U+${apiEmoji.codePoint}`;

    // 4. Normalize Category for UI
    let normalizedCategory = 'others';
    // Mapping for EmojiHub categories
    if (category.includes('smileys') || category.includes('people') || category.includes('emotion')) normalizedCategory = 'smileys';
    else if (category.includes('animals') || category.includes('nature')) normalizedCategory = 'animals';
    else if (category.includes('food') || category.includes('drink')) normalizedCategory = 'food';
    else if (category.includes('travel') || category.includes('places') || category.includes('transport')) normalizedCategory = 'travel';
    else if (category.includes('activities')) normalizedCategory = 'activities';
    else if (category.includes('objects')) normalizedCategory = 'objects';
    else if (category.includes('symbols')) normalizedCategory = 'symbols';
    else if (category.includes('flags')) normalizedCategory = 'flags';

    // 5. Determine Character (The visual Emoji)
    let char = '';
    if (apiEmoji.character) {
        char = apiEmoji.character; // EmojiAPI
    } else if (apiEmoji.emoji) {
        char = apiEmoji.emoji; // Fallback / Self
    } else if (htmlCode) {
        // EmojiHub (decode HTML entity)
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlCode, 'text/html');
        char = doc.body.textContent;
    }

    return {
        id: name.replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
        name: name,
        displayName: name.split(/[- ]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        category: normalizedCategory,
        originalCategory: category,
        group: group,
        emoji: char,
        htmlCode: htmlCode || (char ? `&#${char.codePointAt(0)};` : ''),
        unicode: unicode,
        cssCode: unicode ? `\\${unicode.replace('U+', '').toLowerCase()}` : '',
        keywords: name.split(/[- ]/),
        hasSkinTones: false,
        isNew: Math.random() > 0.9,
        popularity: Math.random(),
    };
};

export const filterEmojis = (emojis, { searchQuery, category, mood, group }) => {
    const query = (searchQuery || '').trim().toLowerCase();
    const activeMood = mood || null;
    const activeGroup = (group || '').trim().toLowerCase() || null;

    return emojis.filter(emoji => {
        // 1. Category Filter
        if (category && category !== 'all' && emoji.category !== category) {
            return false;
        }

        // 1b. Group/Subcategory filter (derived from API group/subGroup)
        if (activeGroup) {
            const eg = (emoji.group || '').toLowerCase();
            if (eg !== activeGroup) return false;
        }

        // 2. Search Filter
        if (query) {
            const name = (emoji.name || '').toLowerCase();
            const displayName = (emoji.displayName || '').toLowerCase();
            const group = (emoji.group || '').toLowerCase();
            const originalCategory = (emoji.originalCategory || '').toLowerCase();
            const keywords = Array.isArray(emoji.keywords) ? emoji.keywords.map(k => (k || '').toLowerCase()) : [];

            const matchesName = name.includes(query) || displayName.includes(query);
            const matchesGroup = group.includes(query) || originalCategory.includes(query);
            const matchesKeywords = keywords.some(k => k.includes(query));

            if (!matchesName && !matchesGroup && !matchesKeywords) return false;
        }

        // 3. Mood Filter (Basic implementation based on keywords)
        if (activeMood) {
            // detailed mood matching is handled in aiMatcher, this is a simple fallback
            const moodMap = {
                happy: ['smile', 'grin', 'joy', 'laugh'],
                sad: ['sad', 'cry', 'tear', 'unhappy'],
                angry: ['angry', 'mad', 'rage'],
                love: ['love', 'heart', 'kiss'],
                surprised: ['surprise', 'wow', 'shock', 'astonish'],
                funny: ['laugh', 'lol', 'rofl', 'funny', 'joker'],
                cool: ['cool', 'sunglasses'],
                scary: ['scare', 'fear', 'horror', 'scream', 'skull', 'ghost'],
            };
            if (moodMap[activeMood]) {
                const haystack = `${emoji.name || ''} ${emoji.displayName || ''} ${(emoji.group || '')} ${(emoji.originalCategory || '')}`.toLowerCase();
                const emojiKeywords = Array.isArray(emoji.keywords) ? emoji.keywords.map(k => (k || '').toLowerCase()) : [];
                const keywords = moodMap[activeMood].map(k => k.toLowerCase());
                const matchesMood = keywords.some(k => haystack.includes(k) || emojiKeywords.some(ek => ek.includes(k)));
                if (!matchesMood) return false;
            }
        }

        return true;
    });
};

export const sortEmojis = (emojis, sortBy) => {
    const sorted = [...emojis];
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name_desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'popular':
            return sorted.sort((a, b) => b.popularity - a.popularity);
        case 'newest':
            return sorted.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
        default:
            return sorted;
    }
};

export const addToHistory = (item, currentHistory, maxLimit = MAX_RECENT_HISTORY) => {
    const filtered = currentHistory.filter(i => i.id !== item.id);
    return [item, ...filtered].slice(0, maxLimit);
};
