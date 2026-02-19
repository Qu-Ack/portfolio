import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContextDefinition';
import type { Theme } from './theme.types';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update CSS variables
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--text-primary', '#e5e5e5');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      root.style.setProperty('--text-muted', '#6b6b6b');
      root.style.setProperty('--link-color', '#7dd3fc');
      root.style.setProperty('--link-hover', '#38bdf8');
      root.style.setProperty('--border-color', '#333333');
      root.style.setProperty('--bg-color', '#0a0a0a');
      root.style.setProperty('--bg-hover', '#171717');
      root.style.setProperty('--code-bg', '#1a1a1a');
      root.style.setProperty('--tag-bg', '#262626');
    } else {
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#525252');
      root.style.setProperty('--text-muted', '#737373');
      root.style.setProperty('--link-color', '#0066cc');
      root.style.setProperty('--link-hover', '#0052a3');
      root.style.setProperty('--border-color', '#e5e5e5');
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--bg-hover', '#f5f5f5');
      root.style.setProperty('--code-bg', '#f5f5f5');
      root.style.setProperty('--tag-bg', '#f0f0f0');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
