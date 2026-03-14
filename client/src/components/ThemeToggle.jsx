import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:outline-none flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 hover:text-amber-500 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 hover:text-indigo-700 transition-colors" />
      )}
    </button>
  );
};  

export default ThemeToggle;