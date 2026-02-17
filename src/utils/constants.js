export const API_PRIMARY = 'https://emojihub.yurace.pro/api/all';
export const API_SECONDARY = 'https://emoji-api.com/emojis?access_key=6c7f3adce1b510952824221dc2215936ee024800'; // Backup or alternative if needed

export const CATEGORIES = [
    { id: 'all', name: 'All Emojis', icon: '✨' },
    { id: 'smileys', name: 'Smileys & People', icon: '😀' },
    { id: 'animals', name: 'Animals & Nature', icon: '🐾' },
    { id: 'food', name: 'Food & Drink', icon: '🍕' },
    { id: 'travel', name: 'Travel & Places', icon: '✈️' },
    { id: 'activities', name: 'Activities', icon: '⚽' },
    { id: 'objects', name: 'Objects', icon: '💻' },
    { id: 'symbols', name: 'Symbols', icon: '❤️' },
    { id: 'flags', name: 'Flags', icon: '🏳️' },
];

export const MOODS = [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'love', name: 'Love', emoji: '🥰' },
    { id: 'angry', name: 'Angry', emoji: '😠' },
    { id: 'surprised', name: 'Surprised', emoji: '😮' },
    { id: 'funny', name: 'Funny', emoji: '🤣' },
    { id: 'cool', name: 'Cool', emoji: '😎' },
    { id: 'scary', name: 'Scary', emoji: '😱' },
];

export const SORT_OPTIONS = [
    { id: 'default', name: 'Default' },
    { id: 'name', name: 'Name (A-Z)' },
    { id: 'name_desc', name: 'Name (Z-A)' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest' },
];

export const ITEMS_PER_PAGE = 80;
export const MAX_RECENT_HISTORY = 20;
export const MAX_RECENT_COPIES = 10;
