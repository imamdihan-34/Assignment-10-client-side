'use client';
import { createContext, useState, useEffect } from 'react';
 
export const ThemeContext = createContext();
 
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
 
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
 
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };
 
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
 