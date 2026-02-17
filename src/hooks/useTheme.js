import { useApp } from '../context/AppContext';

export function useTheme() {
    // Always return 'dark' and a no-op toggle function
    return { theme: 'dark', toggleTheme: () => { } };
}
