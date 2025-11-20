import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    storageKey?: string;
    defaultTheme?: Theme;
}

export const ThemeProvider = ({
                                  children,
                                  storageKey = 'liderplast-theme',
                                  defaultTheme = 'light',
                              }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem(storageKey);
        return (stored as Theme) || defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem(storageKey, theme);
    }, [theme, storageKey]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};