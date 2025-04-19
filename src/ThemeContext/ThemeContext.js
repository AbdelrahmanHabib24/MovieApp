import React, { createContext, useState, useEffect, useCallback } from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

// Create the Theme Context
const ThemeContext = createContext();

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  // Initialize theme state, default to 'light'
  const [theme, setTheme] = useState(() => {
    // Safely access localStorage on the client side
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
      } catch (error) {
        console.error('Failed to access localStorage:', error);
        return 'light';
      }
    }
    return 'light';
  });

  // Apply the theme to the <html> element and save to localStorage
  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window === 'undefined') return;

    const element = document.documentElement;
    try {
      if (theme === 'dark') {
        element.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        element.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  }, [theme]); // Removed 'element' from dependencies since it doesn't change

  // Memoize the toggleTheme function
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Toggle Component (to be used in Header or elsewhere)
const ThemeToggle = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  // Handle keyboard navigation (e.g., Enter key)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`text-2xl p-2 rounded-full transition-all duration-300 transform hover:scale-110  backdrop-blur-glass ${
        theme === 'dark'
          ? 'bg-neutral-800/80 text-yellow-400 hover:bg-neutral-700/80 rotate-0'
          : 'bg-white/20 text-gray-900 hover:bg-neutral-300/80 backdrop-blur-glass rotate-180'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
};

export  { ThemeContext, ThemeProvider, ThemeToggle };